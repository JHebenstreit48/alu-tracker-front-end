import {
  setCarTrackingData,
  CarTrackingData,
} from "@/utils/shared/StorageUtils";
import { syncToAccount } from "@/utils/UserDataSync/syncToAccount";

function getAuthToken(): string | null {
  // Prefer new key, but fall back to old naming if it still exists
  return (
    localStorage.getItem("token") ||
    localStorage.getItem("authToken") ||
    null
  );
}

/**
 * Writes to localStorage and attempts to sync to user account if logged in.
 */
export async function setCarTrackingDataWithSync(
  carKey: string,
  update: Partial<CarTrackingData>
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