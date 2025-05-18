import { getAllCarTrackingData } from "@/components/CarInformation/CarDetails/Miscellaneous/StorageUtils";

export const syncToAccount = async (token: string) => {
  try {
    const allTracked = getAllCarTrackingData();

    const carStars: Record<string, number> = {};
    const ownedCars: string[] = [];
    const goldMaxedCars: string[] = [];
    const keyCarsOwned: string[] = [];

    for (const [carKey, data] of Object.entries(allTracked)) {
      if (data.stars !== undefined) {
        carStars[carKey] = data.stars;
      }
      if (data.owned) {
        ownedCars.push(carKey);
      }
      if (data.goldMax) {
        goldMaxedCars.push(carKey);
      }
      if (data.keyObtained) {
        keyCarsOwned.push(carKey);
      }
    }

    const xp = parseInt(localStorage.getItem("garageXP") || "0", 10);

    const payload = {
      carStars,
      ownedCars,
      goldMaxedCars,
      keyCarsOwned,
      xp,
    };

    const res = await fetch(
      `${import.meta.env.VITE_AUTH_API_URL}/api/users/save-progress`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      }
    );

    const result = await res.json();

    if (!res.ok) {
      console.error("❌ Failed to sync:", result.message || "Unknown error");
      return { success: false, message: result.message };
    }

    console.log("✅ Progress synced to account!");
    return { success: true };
  } catch (err) {
    console.error("❌ Sync error:", err);
    return { success: false, message: "Sync failed due to error." };
  }
};
