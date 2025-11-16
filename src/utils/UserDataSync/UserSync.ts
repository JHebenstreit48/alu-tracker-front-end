import { getAllCarTrackingData } from "@/utils/shared/StorageUtils";

const USER_API_URL = (import.meta.env.VITE_USER_API_URL || "").replace(/\/+$/, "");

export const syncAllTrackedCarsToAccount = async () => {
  // If the backend base URL isn't configured, don't attempt a sync.
  if (!USER_API_URL) {
    console.warn("[UserSync] VITE_USER_API_URL is not set; skipping sync.");
    return;
  }

  const userId = localStorage.getItem("userId");
  const token =
    localStorage.getItem("token") || localStorage.getItem("authToken");

  if (!userId || !token) {
    console.warn("❌ No user ID or auth token found, skipping sync.");
    return;
  }

  const trackingData = getAllCarTrackingData();

  const carStars: Record<string, number> = {};
  const ownedCars: string[] = [];
  const goldMaxedCars: string[] = [];
  const keyCarsOwned: string[] = [];

  for (const [carId, data] of Object.entries(trackingData)) {
    if (typeof data.stars === "number") {
      carStars[carId] = data.stars;
    }
    if (data.owned) {
      ownedCars.push(carId);
    }
    if (data.goldMaxed) {
      goldMaxedCars.push(carId);
    }
    if (data.keyObtained) {
      keyCarsOwned.push(carId);
    }
  }

  const payload = {
    userId,
    carStars,
    ownedCars,
    goldMaxedCars,
    keyCarsOwned,
  };

  const endpoint = `${USER_API_URL}/api/users/save-progress`;

  console.log("🚀 Sending sync request to:", endpoint);
  console.log("📦 Payload:", payload);

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errorText = await res.text().catch(() => "");
      throw new Error(`Sync failed: ${res.status} - ${errorText}`);
    }

    console.log("✅ Tracker data synced successfully");
  } catch (err) {
    console.error("❌ Failed to sync tracking data to backend:", err);
  }
};