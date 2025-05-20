import {
  setCarTrackingData,
  clearAllCarTrackingData,
  generateCarKey,
  CarTrackingData,
} from "@/components/CarInformation/CarDetails/Miscellaneous/StorageUtils";

export const syncFromAccount = async (token: string) => {
  try {
    clearAllCarTrackingData();

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
    console.log("🔍 Raw response text from backend:", rawText);

    let result;
    try {
      result = JSON.parse(rawText);
    } catch {
      console.error("❌ Failed to parse response JSON:", rawText);
      return;
    }

    console.log("📦 Parsed response object:", result);

    if (!res.ok || !result.progress) {
      console.error("❌ Invalid response or missing 'progress' field:", result);
      return;
    }

    const {
      carStars = {},
      ownedCars = [],
      goldMaxedCars = [],
      keyCarsOwned = [],
    } = result.progress;

    const allEmpty =
      Object.keys(carStars).length === 0 &&
      ownedCars.length === 0 &&
      goldMaxedCars.length === 0 &&
      keyCarsOwned.length === 0;

    if (allEmpty) {
      console.warn("⚠️ Sync succeeded but no progress data was found for this account.");
    }

    // ✅ Apply carStars
    for (const rawKey in carStars) {
      const [brand, ...modelParts] = rawKey.split(" ");
      const key = generateCarKey(brand, modelParts.join(" "));
      const update: CarTrackingData = { stars: carStars[rawKey] };
      setCarTrackingData(key, update);
    }

    // ✅ Apply ownedCars
    for (const rawKey of ownedCars) {
      const [brand, ...modelParts] = rawKey.split(" ");
      const key = generateCarKey(brand, modelParts.join(" "));
      const update: CarTrackingData = { owned: true };
      setCarTrackingData(key, update);
    }

    // ✅ Apply goldMaxedCars
    for (const rawKey of goldMaxedCars) {
      const [brand, ...modelParts] = rawKey.split(" ");
      const key = generateCarKey(brand, modelParts.join(" "));
      const update: CarTrackingData = { goldMaxed: true };
      setCarTrackingData(key, update);
    }

    // ✅ Apply keyCarsOwned
    for (const rawKey of keyCarsOwned) {
      const [brand, ...modelParts] = rawKey.split(" ");
      const key = generateCarKey(brand, modelParts.join(" "));
      const update: CarTrackingData = { keyObtained: true };
      setCarTrackingData(key, update);
    }

    // ✅ Final debug printout
    const allKeys = Object.keys(localStorage).filter((k) =>
      k.startsWith("car-tracker-")
    );

    const allTracked: Record<string, CarTrackingData> = {};
    for (const key of allKeys) {
      try {
        const parsed = JSON.parse(localStorage.getItem(key) || "{}");
        allTracked[key] = parsed as CarTrackingData;
      } catch {
        console.warn(`⚠️ Could not parse tracking data for key: ${key}`);
      }
    }

    console.log("✅ Sync complete — local tracking:", allTracked);
  } catch (err) {
    console.error("❌ Failed to sync from account:", err);
  }
};
