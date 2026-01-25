import { setCarTrackingData } from "@/utils/shared/StorageUtils";
import type { CarTracking } from "@/types/shared/tracking";
import { syncToAccount } from "@/utils/UserDataSync/syncToAccount";

function getAuthToken(): string | null {
  return localStorage.getItem("token") || localStorage.getItem("authToken") || null;
}

/**
 * Writes to localStorage and attempts to sync to user account if logged in.
 */
export async function setCarTrackingDataWithSync(
  carKey: string,
  update: Partial<CarTracking>
): Promise<void> {
  // Always store in localStorage
  setCarTrackingData(carKey, update);

  // If user is logged in, sync to backend
  const token = getAuthToken();
  if (token && token.trim() !== "") {
    try {
      await syncToAccount(token);
    } catch (err) {
      console.warn("🔁 Failed to sync with account:", err);
    }
  }
}