import { getAllCarTrackingData } from "@/components/Cars/CarDetails/Miscellaneous/StorageUtils";

type CarStarsMap = Record<string, number>;

interface ProgressPayload {
  carStars: CarStarsMap;
  ownedCars: string[];
  goldMaxedCars: string[];
  keyCarsOwned: string[];
  xp: number;
}

interface SyncOk { success: true; skipped?: true }
interface SyncErr { success: false; message: string }
export type SyncResult = SyncOk | SyncErr;

export interface PushOptions {
  /**
   * Map of normalized keys (e.g. "acura_2017_nsx") → canonical label
   * (e.g. "Acura 2017 NSX"). If not provided, we fallback to
   * turning underscores into spaces.
   */
  labelByKey?: ReadonlyMap<string, string>;
  /** Abort if the request takes longer than this many ms (default 15000). */
  timeoutMs?: number;
}

// "acura_2017_nsx" → "acura 2017 nsx" (fallback if labelByKey not provided)
function fallbackLabelFromKey(normalizedKey: string): string {
  return normalizedKey.replace(/_/g, " ").trim();
}

function isErrorBody(u: unknown): u is { message?: string; error?: string } {
  return typeof u === "object" && u !== null && ("message" in u || "error" in u);
}
const uniq = <T,>(arr: T[]): T[] => Array.from(new Set(arr));

export async function syncToAccount(token: string, opts: PushOptions = {}): Promise<SyncResult> {
  const timeoutMs = typeof opts.timeoutMs === "number" ? opts.timeoutMs : 15000;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const allTracked = getAllCarTrackingData();

    const carStars: Record<string, number> = {};
    const ownedCars: string[] = [];
    const goldMaxedCars: string[] = [];
    const keyCarsOwned: string[] = [];

    for (const [normalizedKey, data] of Object.entries(allTracked)) {
      const label =
        (opts.labelByKey && opts.labelByKey.get(normalizedKey)) ||
        fallbackLabelFromKey(normalizedKey);

      if (typeof data.stars === "number" && data.stars > 0) {
        const stars = Math.min(6, Math.max(1, data.stars));
        carStars[label] = stars;
      }
      if (data.owned)       ownedCars.push(label);
      if (data.goldMaxed)   goldMaxedCars.push(label);
      if (data.keyObtained) keyCarsOwned.push(label);
    }

    const xpValue = localStorage.getItem("garageXP");
    const xp = Number.isFinite(Number(xpValue)) ? parseInt(xpValue ?? "0", 10) : 0;

    const payload: ProgressPayload = {
      carStars,
      ownedCars: uniq(ownedCars),
      goldMaxedCars: uniq(goldMaxedCars),
      keyCarsOwned: uniq(keyCarsOwned),
      xp,
    };

    const isEmpty =
      Object.keys(carStars).length === 0 &&
      payload.ownedCars.length === 0 &&
      payload.goldMaxedCars.length === 0 &&
      payload.keyCarsOwned.length === 0 &&
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
        signal: controller.signal,
      }
    );

    if (!res.ok) {
      const contentType = res.headers.get("content-type") ?? "";
      let msg = `HTTP ${res.status}`;
      if (contentType.includes("application/json")) {
        const bodyUnknown: unknown = await res.json();
        if (isErrorBody(bodyUnknown)) {
          msg = bodyUnknown.message ?? bodyUnknown.error ?? msg;
        }
      } else {
        const text = await res.text();
        msg = text || msg;
      }
      return { success: false, message: msg };
    }

    return { success: true };
  } catch (err) {
    const message =
      err instanceof DOMException && err.name === "AbortError"
        ? `Request timed out after ${timeoutMs}ms`
        : err instanceof Error
        ? err.message
        : "Sync failed due to unknown error.";
    return { success: false, message };
  } finally {
    clearTimeout(timer);
  }
}