import { getAllCarTrackingData } from "@/components/CarInformation/CarDetails/Miscellaneous/StorageUtils";

type CarStarsMap = Record<string, number>;

interface ProgressPayload {
  carStars: CarStarsMap;
  ownedCars: string[];
  goldMaxedCars: string[];
  keyCarsOwned: string[];
  xp: number;
}

interface SyncOk {
  success: true;
  skipped?: true;
}
interface SyncErr {
  success: false;
  message: string;
}
type SyncResult = SyncOk | SyncErr;

// Backend expects "Brand Model" keys; we reverse normalize here.
function revertCarKey(key: string): string {
  return key.replace(/_/g, " ").trim();
}

function isErrorBody(u: unknown): u is { message?: string; error?: string } {
  return (
    typeof u === "object" &&
    u !== null &&
    ("message" in u || "error" in u)
  );
}

export const syncToAccount = async (token: string): Promise<SyncResult> => {
  try {
    const allTracked = getAllCarTrackingData();

    const carStars: Record<string, number> = {};
    const ownedCars: string[] = [];
    const goldMaxedCars: string[] = [];
    const keyCarsOwned: string[] = [];

    for (const [normalizedKey, data] of Object.entries(allTracked)) {
      const revertedKey = revertCarKey(normalizedKey);
      if (typeof data.stars === "number" && data.stars > 0) {
        carStars[revertedKey] = Math.min(6, Math.max(1, data.stars));
      }
      if (data.owned) ownedCars.push(revertedKey);
      if (data.goldMaxed) goldMaxedCars.push(revertedKey);
      if (data.keyObtained) keyCarsOwned.push(revertedKey);
    }

    const xpValue = localStorage.getItem("garageXP");
    const xp = Number.isFinite(Number(xpValue)) ? parseInt(xpValue ?? "0", 10) : 0;

    const payload: ProgressPayload = { carStars, ownedCars, goldMaxedCars, keyCarsOwned, xp };

    // Never send an empty-ish payload — prevents accidental wipes.
    const isEmpty =
      Object.keys(carStars).length === 0 &&
      ownedCars.length === 0 &&
      goldMaxedCars.length === 0 &&
      keyCarsOwned.length === 0 &&
      xp === 0;

    if (isEmpty) {
      console.warn("⏭️ Skip sync: empty snapshot (protected)");
      return { success: true, skipped: true as const };
    }

    const res = await fetch(
      `${import.meta.env.VITE_AUTH_API_URL}/api/users/save-progress`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      }
    );

    // Some backends return 204 No Content.
    let msg = `HTTP ${res.status}`;
    const contentType = res.headers.get("content-type") ?? "";
    if (!res.ok) {
      if (contentType.includes("application/json")) {
        const bodyUnknown: unknown = await res.json();
        if (isErrorBody(bodyUnknown)) {
          msg = bodyUnknown.message ?? bodyUnknown.error ?? msg;
        }
      } else {
        const text = await res.text();
        msg = text || msg;
      }
      console.error("❌ Failed to sync:", msg);
      return { success: false, message: msg };
    }

    console.log("✅ Progress synced to account!");
    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Sync failed due to unknown error.";
    console.error("❌ Sync error:", message);
    return { success: false, message };
  }
};