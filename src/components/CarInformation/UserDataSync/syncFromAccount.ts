import { setCarTrackingData } from "@/components/CarInformation/CarDetails/Miscellaneous/StorageUtils";

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

    const { carStars, ownedCars, goldMaxedCars, keyCarsOwned } = result.progress;

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

    console.log("✅ Local tracking restored from account!");
  } catch (err) {
    console.error("❌ Failed to sync from account:", err);
  }
};
