import { getAllCarTrackingData } from '@/utils/CarDetails/StorageUtils';

const AUTH_API_URL =
  import.meta.env.VITE_AUTH_API_URL ?? 'https://alu-tracker-user-data.onrender.com';

export const syncAllTrackedCarsToMongo = async () => {
  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('authToken');

  if (!userId || !token) {
    console.warn('❌ No user ID or auth token found, skipping sync.');
    return;
  }

  const trackingData = getAllCarTrackingData();

  // Organize tracking data for each category
  const carStars: Record<string, number> = {};
  const ownedCars: string[] = [];
  const goldMaxedCars: string[] = [];
  const keyCarsOwned: string[] = [];

  for (const [carId, data] of Object.entries(trackingData)) {
    if (typeof data.stars === 'number') {
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
    // xp: 0, // omit unless needed
  };

  console.log('🚀 Sending sync request to:', `${AUTH_API_URL}/api/users/save-progress`);
  console.log('📦 Payload:', payload);

  try {
    const res = await fetch(`${AUTH_API_URL}/api/users/save-progress`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Sync failed: ${res.status} - ${errorText}`);
    }

    console.log('✅ Tracker data synced successfully');
  } catch (err) {
    console.error('❌ Failed to sync tracking data to MongoDB:', err);
  }
};