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

// Avoid double-prefixing if stored value is already a full URL
function resolveImageUrl(raw: string): string {
  const s = (raw ?? "").trim();
  if (!s) return "";
  if (/^https?:\/\//i.test(s) || s.startsWith("data:")) return s;
  return getCarImageUrl(s);
}

/**
 * Mirrors a stat block between legacy and canonical keys.
 * We return ONLY canonical keys here.
 */
function pickGoldOrStock(
  data: AnyObj,
  legacyPrefix: "Gold" | "Stock",
  newPrefix: "gold" | "stock"
): AnyObj {
  const out: AnyObj = {};

  const legacyRankKey = legacyPrefix === "Gold" ? "Gold_Max_Rank" : "Stock_Rank";
  const newRankKey = legacyPrefix === "Gold" ? "goldMaxRank" : "stockRank";

  const rank = pickNumber(data, legacyRankKey, newRankKey);
  if (rank !== undefined) out[newRankKey] = rank;

  const map: Array<[string, string]> = [
    [`${legacyPrefix}_Top_Speed`, `${newPrefix}TopSpeed`],
    [`${legacyPrefix}_Acceleration`, `${newPrefix}Acceleration`],
    [`${legacyPrefix}_Handling`, `${newPrefix}Handling`],
    [`${legacyPrefix}_Nitro`, `${newPrefix}Nitro`],
  ];

  for (const [legacyKey, newKey] of map) {
    const n = pickNumber(data, legacyKey, newKey);
    if (n !== undefined) out[newKey] = n;
  }

  return out;
}

function pickStarMax(data: AnyObj, star: 1 | 2 | 3 | 4 | 5 | 6): AnyObj {
  const out: AnyObj = {};

  const word =
    star === 1 ? "One" :
    star === 2 ? "Two" :
    star === 3 ? "Three" :
    star === 4 ? "Four" :
    star === 5 ? "Five" : "Six";

  const legacyBase = `${word}_Star_Max_`;

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
    if (n !== undefined) out[newKey] = n;
  }

  return out;
}

function pickBlueprints(data: AnyObj): AnyObj {
  const out: AnyObj = {};
  for (const star of [1, 2, 3, 4, 5, 6] as const) {
    const legacyKey = `BPs_${star}_Star`;
    const newKey = `blueprints${star}Star`;
    const n = pickNumber(data, legacyKey, newKey);
    if (n !== undefined) out[newKey] = n;
  }
  return out;
}

export async function fetchCarDetail(slug: string): Promise<FullCar> {
  if (!slug || slug.length < 3) throw new Error("Invalid car slug");

  const ref = doc(dbTracker, "cars", slug);
  const snap = await getDoc(ref);
  if (!snap.exists()) throw new Error("Car not found");

  const data = snap.data() as AnyObj;

  const brand = pickString(data, "Brand", "brand").trim();
  const model = pickString(data, "Model", "model").trim();
  const klass = pickString(data, "Class", "class").trim();

  const imageRaw = pickString(data, "Image", "image");
  const image = resolveImageUrl(imageRaw);

  const id = pickNumber(data, "Id", "id") ?? 0;

  const stars = pickNumber(data, "Stars", "stars");
  const rarity = pickString(data, "Rarity", "rarity").trim();
  const country = pickString(data, "Country", "country").trim();
  const keyCar = pickBool(data, "KeyCar", "keyCar");
  const obtainableVia = pickStringArrayOrString(data, "ObtainableVia", "obtainableVia");
  const epics = pickNumber(data, "Epics", "epics");

  const added = pickString(data, "Added", "added").trim();
  const addedWith = data["Added_With"] ?? data["addedWith"];
  const addedDate = pickString(data, "Added date", "addedDate").trim();
  const tags = pickString(data, "Tags", "tags").trim();

  const merged: AnyObj = {
    // keep original extras for now (safe during migration)
    ...data,

    // ✅ canonical identity
    id,
    brand,
    model,
    class: klass,
    image,

    ...(stars !== undefined ? { stars } : {}),
    ...(rarity ? { rarity } : {}),
    ...(country ? { country } : {}),
    ...(keyCar !== undefined ? { keyCar } : {}),
    ...(obtainableVia !== undefined ? { obtainableVia } : {}),
    ...(epics !== undefined ? { epics } : {}),
    ...(added ? { added } : {}),
    ...(addedDate ? { addedDate } : {}),
    ...(tags ? { tags } : {}),
    ...(addedWith !== undefined ? { addedWith } : {}),

    // ✅ canonical stat blocks only
    ...pickBlueprints(data),
    ...pickGoldOrStock(data, "Stock", "stock"),
    ...pickGoldOrStock(data, "Gold", "gold"),
    ...pickStarMax(data, 1),
    ...pickStarMax(data, 2),
    ...pickStarMax(data, 3),
    ...pickStarMax(data, 4),
    ...pickStarMax(data, 5),
    ...pickStarMax(data, 6),
  };

  return merged as FullCar;
}

// -------- status --------

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
  if ("toDate" in v && typeof (v as any).toDate === "function") {
    return (v as any).toDate().toISOString();
  }
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