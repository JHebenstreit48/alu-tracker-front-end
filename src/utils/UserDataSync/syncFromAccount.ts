import {
  setCarTrackingData,
  generateCarKey,
  getCarTrackingData,
} from '@/utils/shared/StorageUtils';
import type { CarTracking } from '@/types/shared/tracking';

type CarStarsMap = Record<string, number>;

// ✅ Blueprint entry matches backend shape
type BlueprintSyncEntry = {
  ownedByStar: Record<number, number>;
  updatedAt: number;
};

// ✅ Blueprint map type
type BlueprintsByCarMap = Record<string, BlueprintSyncEntry>;

interface ServerProgress {
  carStars?: CarStarsMap;
  ownedCars?: string[];
  goldMaxedCars?: string[];
  keyCarsOwned?: string[];
  xp?: number;

  // ✅ blueprint tracking from server
  blueprintsByCar?: BlueprintsByCarMap;
}

interface ProgressResponse {
  progress?: ServerProgress;
}

export interface PullResult {
  success: boolean;
  message?: string;
}

function isObject(u: unknown): u is Record<string, unknown> {
  return typeof u === 'object' && u !== null;
}

function isProgressResponse(u: unknown): u is ProgressResponse {
  return isObject(u) && 'progress' in u;
}

function safeParseJSON(text: string): unknown {
  try {
    return text ? JSON.parse(text) : {};
  } catch {
    return {};
  }
}

// "Brand Model" → storage key
function labelToKey(label: string): string {
  const [brand, ...modelParts] = label.split(' ');
  return generateCarKey(brand, modelParts.join(' '));
}

const KEY_PREFIX = 'car-tracker-';
const USER_API_BASE = (import.meta.env.VITE_USER_API_URL || '').replace(/\/+$/, '');

export async function syncFromAccount(
  token: string,
  opts: { timeoutMs?: number } = {}
): Promise<PullResult> {
  const timeoutMs = typeof opts.timeoutMs === 'number' ? opts.timeoutMs : 15000;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  if (!USER_API_BASE) {
    return { success: false, message: 'User API base URL is not configured.' };
  }

  try {
    const url = `${USER_API_BASE}/api/users/get-progress`;
    const res = await fetch(url, {
      method: 'GET',
      credentials: 'include',
      headers: { Authorization: `Bearer ${token}` },
      signal: controller.signal,
    });

    const rawText = await res.text();
    const dataUnknown = safeParseJSON(rawText);

    if (!res.ok) {
      const message =
        (isObject(dataUnknown) &&
          (typeof dataUnknown['message'] === 'string'
            ? dataUnknown['message']
            : typeof dataUnknown['error'] === 'string'
              ? dataUnknown['error']
              : undefined)) ||
        `HTTP ${res.status}`;
      return { success: false, message };
    }

    if (!isProgressResponse(dataUnknown) || !dataUnknown.progress) {
      return { success: true, message: 'No progress found on server' };
    }

    const p = dataUnknown.progress;

    const carStars: CarStarsMap = p.carStars ?? {};
    const ownedCars: string[] = p.ownedCars ?? [];
    const goldMaxedCars: string[] = p.goldMaxedCars ?? [];
    const keyCarsOwned: string[] = p.keyCarsOwned ?? [];

    // ✅ blueprint data
    const blueprintsByCar: BlueprintsByCarMap = p.blueprintsByCar ?? {};

    // Build all server labels → keys
    const allLabels = new Set<string>([
      ...Object.keys(carStars),
      ...ownedCars,
      ...goldMaxedCars,
      ...keyCarsOwned,

      // ✅ include blueprint labels so they don't get pruned
      ...Object.keys(blueprintsByCar),
    ]);

    const serverKeys = new Set<string>();
    for (const label of allLabels) {
      if (typeof label === 'string' && label.trim() !== '') {
        serverKeys.add(labelToKey(label));
      }
    }

    // Remove local entries not on server
    for (let i = 0; i < localStorage.length; i++) {
      const storageKey = localStorage.key(i);
      if (!storageKey || !storageKey.startsWith(KEY_PREFIX)) continue;
      const carKey = storageKey.slice(KEY_PREFIX.length);
      if (!serverKeys.has(carKey)) {
        localStorage.removeItem(storageKey);
        i--;
      }
    }

    // Write exact server truth
    const ownedSet = new Set<string>(ownedCars);
    const goldSet = new Set<string>(goldMaxedCars);
    const keySet = new Set<string>(keyCarsOwned);

    for (const label of allLabels) {
      const key = labelToKey(label);
      const current = getCarTrackingData(key);
      const starsFromServer = carStars[label] ?? 0;

      // ✅ blueprint snapshot (if any)
      const bpEntry = blueprintsByCar[label];
      const bpOwnedByStar = bpEntry?.ownedByStar;

      const next: CarTracking = {
        ...current,
        owned: ownedSet.has(label),
        goldMaxed: goldSet.has(label),
        keyObtained: keySet.has(label),
        stars: starsFromServer > 0 ? starsFromServer : undefined,

        ...(bpOwnedByStar
          ? {
              blueprints: {
                ...(current.blueprints ?? {}),
                ownedByStar: bpOwnedByStar,
              },
            }
          : {}),
      };

      setCarTrackingData(key, next);
    }

    return { success: true };
  } catch (err) {
    const message =
      err instanceof DOMException && err.name === 'AbortError'
        ? `Request timed out after ${timeoutMs}ms`
        : err instanceof Error
          ? err.message
          : 'Failed to fetch user progress';
    return { success: false, message };
  } finally {
    clearTimeout(timer);
  }
}