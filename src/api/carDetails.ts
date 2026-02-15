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

function asObj(v: unknown): AnyObj | null {
  if (!v || typeof v !== "object" || Array.isArray(v)) return null;
  return v as AnyObj;
}

function numFromObj(o: AnyObj | null, key: string): number | undefined {
  if (!o) return undefined;
  const v = o[key];
  if (typeof v === "number") return v;
  if (typeof v === "string" && v.trim() !== "" && !isNaN(Number(v))) return Number(v);
  return undefined;
}

/**
 * Mirrors a stat block between legacy and canonical keys.
 * We return ONLY canonical flat keys here (stockRank, goldTopSpeed, etc)
 *
 * Enhancement: If V2 object exists (data.stock / data.gold), prefer it.
 */
function pickGoldOrStock(
  data: AnyObj,
  legacyPrefix: "Gold" | "Stock",
  newPrefix: "gold" | "stock"
): AnyObj {
  const out: AnyObj = {};

  const legacyRankKey = legacyPrefix === "Gold" ? "Gold_Max_Rank" : "Stock_Rank";
  const newRankKey = legacyPrefix === "Gold" ? "goldMaxRank" : "stockRank";

  // V2 objects: data.gold.rank / data.stock.rank
  const v2Obj = asObj(data[newPrefix]);

  if (legacyPrefix === "Gold") {
    // legacy uses goldMaxRank but V2 uses gold.rank
    const rankFromV2 = numFromObj(v2Obj, "rank");
    const rank = rankFromV2 ?? pickNumber(data, legacyRankKey, newRankKey);
    if (rank !== undefined) out[newRankKey] = rank;
  } else {
    const rankFromV2 = numFromObj(v2Obj, "rank");
    const rank = rankFromV2 ?? pickNumber(data, legacyRankKey, newRankKey);
    if (rank !== undefined) out[newRankKey] = rank;
  }

  const map: Array<[string, string, string]> = [
    [`${legacyPrefix}_Top_Speed`, `${newPrefix}TopSpeed`, "topSpeed"],
    [`${legacyPrefix}_Acceleration`, `${newPrefix}Acceleration`, "acceleration"],
    [`${legacyPrefix}_Handling`, `${newPrefix}Handling`, "handling"],
    [`${legacyPrefix}_Nitro`, `${newPrefix}Nitro`, "nitro"],
  ];

  for (const [legacyKey, flatKey, v2Key] of map) {
    const nFromV2 = numFromObj(v2Obj, v2Key);
    const n = nFromV2 ?? pickNumber(data, legacyKey, flatKey);
    if (n !== undefined) out[flatKey] = n;
  }

  return out;
}

/**
 * Star Max:
 * - Legacy flat keys: oneStarMaxRank, twoStarMaxTopSpeed, etc
 * - V2 nested object: maxStar.oneStar.rank etc
 *
 * We still OUTPUT flat keys to keep UI stable.
 */
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

  const v2MaxStar = asObj(data.maxStar);
  const v2StarKey =
    star === 1 ? "oneStar" :
    star === 2 ? "twoStar" :
    star === 3 ? "threeStar" :
    star === 4 ? "fourStar" :
    star === 5 ? "fiveStar" : "sixStar";

  const v2StarObj = asObj(v2MaxStar?.[v2StarKey]);

  const fields: Array<[string, string, string]> = [
    ["Rank", "Rank", "rank"],
    ["Top_Speed", "TopSpeed", "topSpeed"],
    ["Acceleration", "Acceleration", "acceleration"],
    ["Handling", "Handling", "handling"],
    ["Nitro", "Nitro", "nitro"],
  ];

  for (const [legacySuffix, flatSuffix, v2Key] of fields) {
    const legacyKey = `${legacyBase}${legacySuffix}`;
    const flatKey = `${newBase}${flatSuffix}`;

    const fromV2 = numFromObj(v2StarObj, v2Key);
    const n = fromV2 ?? pickNumber(data, legacyKey, flatKey);

    if (n !== undefined) out[flatKey] = n;
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

    // ✅ canonical stat blocks (flat) — now supports V2 nested sources too
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