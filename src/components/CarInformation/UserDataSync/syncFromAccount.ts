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

/**
 * Pull server progress and merge into local per-car records:
 * - stars: max(server, local)
 * - owned/gold/key: union
 * NO clearAllCarTrackingData() — avoids "empty window" races.
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
      // xp is currently not stored locally here (kept for future use)
    } = resultUnknown.progress;

    // Index arrays for quick lookup
    const ownedSet = new Set(ownedCars);
    const goldSet = new Set(goldMaxedCars);
    const keySet = new Set(keyCarsOwned);

    // Merge each mentioned car from carStars
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

    // Ensure cars present only in arrays still get merged
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

    console.log("✅ Sync-from-account completed (merged safely)");
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error during sync-from-account.";
    console.error("❌ Failed to sync from account:", message);
  }
};