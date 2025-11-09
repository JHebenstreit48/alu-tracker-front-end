import { setCarTrackingData, CarTrackingData } from "@/utils/shared/StorageUtils";
import { syncToAccount } from "@/components/UserDataSync/syncToAccount";

function getAuthToken(): string | null {
  return localStorage.getItem("token"); // Or use AuthContext for live session
}

/**
 * Writes to localStorage and attempts to sync to user account if logged in.
 */
export async function setCarTrackingDataWithSync(
  carKey: string,
  update: Partial<CarTrackingData>
) {
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