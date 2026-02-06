import { doc, getDoc, type Timestamp } from "firebase/firestore";
import { dbTracker } from "@/Firebase/client";

import type { FullCar } from "@/types/shared/car";
import type { CarStatus, ApiStatusDoc } from "@/types/shared/status";
import { mapApiStatus } from "@/utils/CarDetails/status";
import { getCarImageUrl } from "@/utils/shared/imageUrl";

type AnyObj = Record<string, unknown>;

function pickString(data: AnyObj, legacyKey: string, newKey: string): string {
  const v = data[legacyKey] ?? data[newKey];
  return v == null ? "" : String(v);
}

function pickNumber(data: AnyObj, legacyKey: string, newKey: string): number | undefined {
  const v = data[legacyKey] ?? data[newKey];
  if (typeof v === "number") return v;
  if (typeof v === "string" && v.trim() !== "" && !isNaN(Number(v))) return Number(v);
  return undefined;
}

function pickBool(data: AnyObj, legacyKey: string, newKey: string): boolean | undefined {
  const v = data[legacyKey] ?? data[newKey];
  return typeof v === "boolean" ? v : undefined;
}

function pickStringArrayOrString(
  data: AnyObj,
  legacyKey: string,
  newKey: string
): string[] | string | null | undefined {
  const v = data[legacyKey] ?? data[newKey];
  if (v === null) return null;
  if (typeof v === "string") return v;
  if (Array.isArray(v) && v.every((x) => typeof x === "string")) return v as string[];
  return undefined;
}

// Mirrors a "rank/topSpeed/accel/handling/nitro" stat block between legacy and new keys.
// Example usage:
// - ("Gold", "gold") mirrors Gold_Max_Rank <-> goldMaxRank, Gold_Top_Speed <-> goldTopSpeed, etc.
function mirrorGoldOrStock(data: AnyObj, legacyPrefix: "Gold" | "Stock", newPrefix: "gold" | "stock"): AnyObj {
  const out: AnyObj = {};

  // Rank (special naming on legacy)
  const legacyRankKey = legacyPrefix === "Gold" ? "Gold_Max_Rank" : "Stock_Rank";
  const newRankKey = legacyPrefix === "Gold" ? "goldMaxRank" : "stockRank";
  const rank = pickNumber(data, legacyRankKey, newRankKey);
  if (rank !== undefined) {
    out[legacyRankKey] = rank;
    out[newRankKey] = rank;
  }

  // The rest match pretty cleanly
  const map: Array<[string, string]> = [
    [`${legacyPrefix}_Top_Speed`, `${newPrefix}TopSpeed`],
    [`${legacyPrefix}_Acceleration`, `${newPrefix}Acceleration`],
    [`${legacyPrefix}_Handling`, `${newPrefix}Handling`],
    [`${legacyPrefix}_Nitro`, `${newPrefix}Nitro`],
  ];

  for (const [legacyKey, newKey] of map) {
    const n = pickNumber(data, legacyKey, newKey);
    if (n !== undefined) {
      out[legacyKey] = n;
      out[newKey] = n;
    }
  }

  return out;
}

function mirrorStarMax(data: AnyObj, star: 1 | 2 | 3 | 4 | 5 | 6): AnyObj {
  const out: AnyObj = {};
  const word =
    star === 1 ? "One" :
    star === 2 ? "Two" :
    star === 3 ? "Three" :
    star === 4 ? "Four" :
    star === 5 ? "Five" : "Six";

  // legacy keys used by your current UI/types
  const legacyBase = `${word}_Star_Max_`;

  // new keys used by Firestore after your rename
  const newBase =
    star === 1 ? "oneStarMax" :
    star === 2 ? "twoStarMax" :
    star === 3 ? "threeStarMax" :
    star === 4 ? "fourStarMax" :
    star === 5 ? "fiveStarMax" : "sixStarMax";

  const fields: Array<[string, string]> = [
    ["Rank", "Rank"],
    ["Top_Speed", "TopSpeed"],
    ["Acceleration", "Acceleration"],
    ["Handling", "Handling"],
    ["Nitro", "Nitro"],
  ];

  for (const [legacySuffix, newSuffix] of fields) {
    const legacyKey = `${legacyBase}${legacySuffix}`;
    const newKey = `${newBase}${newSuffix}`;

    const n = pickNumber(data, legacyKey, newKey);
    if (n !== undefined) {
      out[legacyKey] = n;
      out[newKey] = n;
    }
  }

  return out;
}

function mirrorBlueprints(data: AnyObj): AnyObj {
  const out: AnyObj = {};
  for (const star of [1, 2, 3, 4, 5, 6] as const) {
    const legacyKey = `BPs_${star}_Star`;
    const newKey = `blueprints${star}Star`;
    const n = pickNumber(data, legacyKey, newKey);
    if (n !== undefined) {
      out[legacyKey] = n;
      out[newKey] = n;
    }
  }
  return out;
}

export async function fetchCarDetail(slug: string): Promise<FullCar> {
  if (!slug || slug.length < 3) throw new Error("Invalid car slug");

  const ref = doc(dbTracker, "cars", slug);
  const snap = await getDoc(ref);
  if (!snap.exists()) throw new Error("Car not found");

  const data = snap.data() as unknown as AnyObj;

  // Core identity (you already had these)
  const Brand = pickString(data, "Brand", "brand");
  const Model = pickString(data, "Model", "model");
  const Class = pickString(data, "Class", "class");
  const ImageRaw = pickString(data, "Image", "image");
  const Id = pickNumber(data, "Id", "id") ?? 0;

  // Fields your UI currently reads (legacy)
  const Stars = pickNumber(data, "Stars", "stars");
  const Rarity = pickString(data, "Rarity", "rarity");
  const Country = pickString(data, "Country", "country");
  const KeyCar = pickBool(data, "KeyCar", "keyCar");
  const ObtainableVia = pickStringArrayOrString(data, "ObtainableVia", "obtainableVia");
  const Epics = pickNumber(data, "Epics", "epics");

  // extra common renamed fields (nice to keep consistent)
  const Added = pickString(data, "Added", "added");
  const Added_With = (data["Added_With"] ?? data["addedWith"]) as unknown;
  const AddedDate = pickString(data, "Added date", "addedDate");
  const Tags = pickString(data, "Tags", "tags");

  const merged: AnyObj = {
    ...data,

    // ✅ Always provide legacy keys used by current UI/types
    Id,
    Brand,
    Model,
    Class,
    Image: getCarImageUrl(ImageRaw),

    ...(Stars !== undefined ? { Stars } : {}),
    ...(Rarity ? { Rarity } : {}),
    ...(Country ? { Country } : {}),
    ...(KeyCar !== undefined ? { KeyCar } : {}),
    ...(ObtainableVia !== undefined ? { ObtainableVia } : {}),
    ...(Epics !== undefined ? { Epics } : {}),

    ...(Added ? { Added } : {}),
    ...(AddedDate ? { "Added date": AddedDate } : {}),
    ...(Tags ? { Tags } : {}),
    ...(Added_With !== undefined ? { Added_With } : {}),

    // ✅ Also provide new keys (so new code can start using them anytime)
    id: Id,
    brand: Brand,
    model: Model,
    class: Class,
    image: ImageRaw,

    ...(Stars !== undefined ? { stars: Stars } : {}),
    ...(Rarity ? { rarity: Rarity } : {}),
    ...(Country ? { country: Country } : {}),
    ...(KeyCar !== undefined ? { keyCar: KeyCar } : {}),
    ...(ObtainableVia !== undefined ? { obtainableVia: ObtainableVia } : {}),
    ...(Epics !== undefined ? { epics: Epics } : {}),

    ...(Added ? { added: Added } : {}),
    ...(AddedDate ? { addedDate: AddedDate } : {}),
    ...(Tags ? { tags: Tags } : {}),
    ...(Added_With !== undefined ? { addedWith: Added_With } : {}),

    // ✅ Blueprints (critical for your "No blueprint data available" issue)
    ...mirrorBlueprints(data),

    // ✅ Stock + Gold (for stats tables)
    ...mirrorGoldOrStock(data, "Stock", "stock"),
    ...mirrorGoldOrStock(data, "Gold", "gold"),

    // ✅ 1–6 star max stats
    ...mirrorStarMax(data, 1),
    ...mirrorStarMax(data, 2),
    ...mirrorStarMax(data, 3),
    ...mirrorStarMax(data, 4),
    ...mirrorStarMax(data, 5),
    ...mirrorStarMax(data, 6),
  };

  return merged as unknown as FullCar;
}

type FirestoreStatusDoc = {
  status?: string;
  message?: string;
  updatedAt?: Timestamp | Date | string;
  createdAt?: Timestamp | Date | string;
};

function toIsoString(v?: Timestamp | Date | string): string | undefined {
  if (!v) return undefined;
  if (typeof v === "string") return v;
  if (v instanceof Date) return v.toISOString();
  if ("toDate" in v && typeof v.toDate === "function") return v.toDate().toISOString();
  return undefined;
}

export async function fetchCarStatus(slug: string): Promise<CarStatus | null> {
  if (!slug || slug.length < 3) return null;

  const ref = doc(dbTracker, "car_data_status", slug);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;

  const raw = snap.data() as FirestoreStatusDoc;

  const statusDoc: ApiStatusDoc = {
    status: raw.status ?? "unknown",
    message: raw.message,
    updatedAt: toIsoString(raw.updatedAt),
    createdAt: toIsoString(raw.createdAt),
  };

  return mapApiStatus(statusDoc);
}