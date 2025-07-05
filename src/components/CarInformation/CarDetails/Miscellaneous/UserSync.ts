import { getAllCarTrackingData } from './StorageUtils';

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

  try {
    const res = await fetch(`${AUTH_API_URL}/api/users/sync-tracking`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        userId,
        allTrackingData: trackingData,
      }),
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