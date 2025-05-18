import { setCarTrackingData } from "@/components/CarInformation/CarDetails/Miscellaneous/StorageUtils";

interface CarTrackingData {
  owned?: boolean;
  stars?: number;
  goldMax?: boolean;
  keyObtained?: boolean;
  upgradeStage?: number;
  importParts?: number;
}

function normalizeKey(key: string) {
  return key.toLowerCase().replace(/\s+/g, "_");
}

export const syncFromAccount = async (token: string) => {
  try {
    const res = await fetch(
      `${import.meta.env.VITE_AUTH_API_URL}/api/users/get-progress`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const rawText = await res.text();
    let result;

    try {
      result = JSON.parse(rawText);
    } catch {
      console.error("❌ Failed to parse response JSON:", rawText);
      return;
    }

    if (!res.ok || !result.progress) {
      console.error("❌ Invalid response or no progress data:", result);
      return;
    }

    const { carStars = {}, ownedCars = [], goldMaxedCars = [], keyCarsOwned = [] } = result.progress;

    console.log("📥 Incoming sync data:");
    console.log("▶️ carStars:", carStars);
    console.log("▶️ ownedCars:", ownedCars);
    console.log("▶️ goldMaxedCars:", goldMaxedCars);
    console.log("▶️ keyCarsOwned:", keyCarsOwned);

    for (const rawKey in carStars) {
      const key = normalizeKey(rawKey);
      setCarTrackingData(key, { stars: carStars[rawKey] });
    }
    for (const rawKey of ownedCars) {
      const key = normalizeKey(rawKey);
      setCarTrackingData(key, { owned: true });
    }
    for (const rawKey of goldMaxedCars) {
      const key = normalizeKey(rawKey);
      setCarTrackingData(key, { goldMax: true });
    }
    for (const rawKey of keyCarsOwned) {
      const key = normalizeKey(rawKey);
      setCarTrackingData(key, { keyObtained: true });
    }

    console.log("✅ LocalStorage after sync:");
    console.log("🧪 All local keys:", Object.keys(localStorage).filter(k => k.startsWith("car-tracker-")));

    const allTracked: Record<string, CarTrackingData> = {};

    for (const key in localStorage) {
      if (key.startsWith("car-tracker-")) {
        try {
          const parsed = JSON.parse(localStorage.getItem(key) || "{}");
          allTracked[key] = parsed as CarTrackingData;
        } catch {
          console.warn(`⚠️ Could not parse tracking data for key: ${key}`);
        }
      }
    }

    console.log("🧪 Full tracking snapshot:", allTracked);
  } catch (err) {
    console.error("❌ Failed to sync from account:", err);
  }
};
