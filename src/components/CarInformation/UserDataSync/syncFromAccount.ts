import {
  setCarTrackingData,
  clearAllCarTrackingData,
} from "@/components/CarInformation/CarDetails/Miscellaneous/StorageUtils";

interface CarTrackingData {
  owned?: boolean;
  stars?: number;
  goldMax?: boolean;
  keyObtained?: boolean;
  upgradeStage?: number;
  importParts?: number;
}

export const syncFromAccount = async (token: string) => {
  try {
    // ✅ 1. Clear stale local data
    clearAllCarTrackingData();

    // ✅ 2. Fetch latest progress from backend
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

    const {
      carStars = {},
      ownedCars = [],
      goldMaxedCars = [],
      keyCarsOwned = [],
    } = result.progress;

    console.log("📥 Incoming sync data:");
    console.log("▶️ carStars:", carStars);
    console.log("▶️ ownedCars:", ownedCars);
    console.log("▶️ goldMaxedCars:", goldMaxedCars);
    console.log("▶️ keyCarsOwned:", keyCarsOwned);

    // ✅ 3. Restore progress directly (no normalization)
    for (const key in carStars) {
      setCarTrackingData(key, { stars: carStars[key] });
    }
    for (const key of ownedCars) {
      setCarTrackingData(key, { owned: true });
    }
    for (const key of goldMaxedCars) {
      setCarTrackingData(key, { goldMax: true });
    }
    for (const key of keyCarsOwned) {
      setCarTrackingData(key, { keyObtained: true });
    }

    // ✅ 4. Debug snapshot after syncing
    console.log("✅ LocalStorage after sync:");
    const allKeys = Object.keys(localStorage).filter((k) =>
      k.startsWith("car-tracker-")
    );
    console.log("🧪 All local keys:", allKeys);

    const allTracked: Record<string, CarTrackingData> = {};
    for (const key of allKeys) {
      try {
        const parsed = JSON.parse(localStorage.getItem(key) || "{}");
        allTracked[key] = parsed as CarTrackingData;
      } catch {
        console.warn(`⚠️ Could not parse tracking data for key: ${key}`);
      }
    }

    console.log("🧪 Full tracking snapshot:", allTracked);
  } catch (err) {
    console.error("❌ Failed to sync from account:", err);
  }
};
