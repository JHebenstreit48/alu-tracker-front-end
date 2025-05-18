import { setCarTrackingData } from "@/components/CarInformation/CarDetails/Miscellaneous/StorageUtils";

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

    const result = await res.json();

    if (!res.ok || !result.progress) {
      console.error("❌ Failed to fetch progress from account");
      return;
    }

    const { carStars, ownedCars, goldMaxedCars, keyCarsOwned } = result.progress;

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

    console.log("✅ Local tracking restored from account!");
  } catch (err) {
    console.error("❌ Failed to sync from account:", err);
  }
};
