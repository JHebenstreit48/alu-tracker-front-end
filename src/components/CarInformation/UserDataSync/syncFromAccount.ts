import {
  setCarTrackingData,
  generateCarKey,
  CarTrackingData,
  getCarTrackingData,
} from "@/components/CarInformation/CarDetails/Miscellaneous/StorageUtils";

type CarStarsMap = Record<string, number>;

interface ServerProgress {
  carStars?: CarStarsMap;
  ownedCars?: string[];
  goldMaxedCars?: string[];
  keyCarsOwned?: string[];
  xp?: number;
}
interface ProgressResponse {
  progress?: ServerProgress;
}

function isProgressResponse(u: unknown): u is ProgressResponse {
  return typeof u === "object" && u !== null && "progress" in (u as object);
}

// Minimal alias map inline (keeps this file self-contained)
const ALIAS_MAP = new Map<string, string>([
  ["Acura NSX", "Acura 2017 NSX"],
  ["Lexus BEV Sport Concept", "Lexus Electrified Sport Concept"],
]);

/** Collapse any legacy keys in localStorage into the new canonical keys (lossless merge). */
function migrateLegacyLocalKeysOnce() {
  for (const [legacy, modern] of ALIAS_MAP) {
    const [b1, ...m1] = legacy.split(" ");
    const [b2, ...m2] = modern.split(" ");
    const oldKey = generateCarKey(b1, m1.join(" "));
    const newKey = generateCarKey(b2, m2.join(" "));
    const oldData = getCarTrackingData(oldKey);
    if (!oldData || Object.keys(oldData).length === 0) continue;

    const newData = getCarTrackingData(newKey) || {};
    const merged = {
      ...newData,
      owned: !!(newData.owned || oldData.owned),
      goldMaxed: !!(newData.goldMaxed || oldData.goldMaxed),
      keyObtained: !!(newData.keyObtained || oldData.keyObtained),
      stars: Math.max(Number(newData.stars || 0), Number(oldData.stars || 0)) || undefined,
    } as CarTrackingData;

    setCarTrackingData(newKey, merged);
    localStorage.removeItem(`car-tracker-${oldKey}`);
  }
}

/**
 * Pull server progress and merge into local per-car records:
 * - stars: max(server, local)
 * - owned/gold/key: union
 */
export const syncFromAccount = async (token: string): Promise<void> => {
  try {
    const res = await fetch(
      `${import.meta.env.VITE_AUTH_API_URL}/api/users/get-progress`,
      {
        method: "GET",
        credentials: "include",
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const rawText = await res.text();
    let resultUnknown: unknown;
    try {
      resultUnknown = rawText ? JSON.parse(rawText) : {};
    } catch {
      console.error("❌ Failed to parse response JSON:", rawText);
      return;
    }

    if (!res.ok) {
      const msg =
        (typeof resultUnknown === "object" &&
          resultUnknown !== null &&
          ("message" in resultUnknown || "error" in resultUnknown) &&
          ((resultUnknown as { message?: string; error?: string }).message ??
            (resultUnknown as { message?: string; error?: string }).error)) ||
        `HTTP ${res.status}`;
      console.error("❌ Invalid response:", msg);
      return;
    }

    if (!isProgressResponse(resultUnknown) || !resultUnknown.progress) {
      console.warn("ℹ️ No progress returned (first-time user?).");
      return;
    }

    const {
      carStars = {},
      ownedCars = [],
      goldMaxedCars = [],
      keyCarsOwned = [],
    } = resultUnknown.progress;

    // Because your backend now normalizes to canonical labels, raw keys here are already "new".
    const ownedSet = new Set(ownedCars);
    const goldSet = new Set(goldMaxedCars);
    const keySet = new Set(keyCarsOwned);

    const touched = new Set<string>();

    for (const rawKey of Object.keys(carStars)) {
      const [brand, ...modelParts] = rawKey.split(" ");
      const key = generateCarKey(brand, modelParts.join(" "));
      const local = getCarTrackingData(key);

      const serverStar = carStars[rawKey] ?? 0;
      const localStar = typeof local.stars === "number" ? local.stars : 0;
      const mergedStars = Math.max(localStar, serverStar);
      const starsField = mergedStars > 0 ? { stars: mergedStars } : {};

      const update: CarTrackingData = {
        ...local,
        ...starsField,
        owned: Boolean(local.owned || ownedSet.has(rawKey)),
        goldMaxed: Boolean(local.goldMaxed || goldSet.has(rawKey)),
        keyObtained: Boolean(local.keyObtained || keySet.has(rawKey)),
      };
      setCarTrackingData(key, update);
      touched.add(key);
    }

    const arraysOnly = new Set<string>([
      ...ownedCars,
      ...goldMaxedCars,
      ...keyCarsOwned,
    ]);

    for (const rawKey of arraysOnly) {
      const [brand, ...modelParts] = rawKey.split(" ");
      const key = generateCarKey(brand, modelParts.join(" "));
      if (touched.has(key)) continue;

      const local = getCarTrackingData(key);
      const update: CarTrackingData = {
        ...local,
        owned: Boolean(local.owned || ownedSet.has(rawKey)),
        goldMaxed: Boolean(local.goldMaxed || goldSet.has(rawKey)),
        keyObtained: Boolean(local.keyObtained || keySet.has(rawKey)),
      };
      setCarTrackingData(key, update);
    }

    // One-time local collapse for any legacy keys still hanging around
    migrateLegacyLocalKeysOnce();

    console.log("✅ Sync-from-account completed (merged safely)");
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error during sync-from-account.";
    console.error("❌ Failed to sync from account:", message);
  }
};