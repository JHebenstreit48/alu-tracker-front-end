import { getAllCarTrackingData } from '@/utils/shared/StorageUtils';
import type { ProgressPayload, PushOptions, SyncResult } from '@/types/Tracking/userDataSync';

const USER_API_BASE = (import.meta.env.VITE_USER_API_URL || '').replace(/\/+$/, '');

const uniq = <T>(arr: T[]): T[] => Array.from(new Set(arr));

function fallbackLabelFromKey(normalizedKey: string): string {
  return normalizedKey.replace(/_/g, ' ').trim();
}

function isErrorBody(u: unknown): u is { message?: string; error?: string } {
  return typeof u === 'object' && u !== null && ('message' in u || 'error' in u);
}

function readGarageLevelSnapshot() {
  // Prefer new keys, fall back to legacy "garageXP" for backward compatibility
  const xpRaw = localStorage.getItem('currentXp') ?? localStorage.getItem('garageXP') ?? '0';
  const xp = Number.isFinite(Number(xpRaw)) ? parseInt(xpRaw, 10) : 0;

  const levelRaw = localStorage.getItem('currentGarageLevel') ?? '1';
  const currentGarageLevel = Number.isFinite(Number(levelRaw)) ? parseInt(levelRaw, 10) : 1;

  const garageLevelTrackerMode = localStorage.getItem('garageLevelTrackerMode') ?? 'default';

  // Mirror xp into currentGLXp so old + new code agree
  const currentGLXp = xp;

  return { xp, currentGarageLevel, currentGLXp, garageLevelTrackerMode };
}

export async function syncToAccount(token: string, opts: PushOptions = {}): Promise<SyncResult> {
  const timeoutMs = typeof opts.timeoutMs === 'number' ? opts.timeoutMs : 15000;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  if (!USER_API_BASE) {
    return { success: false, message: 'User API base URL is not configured.' };
  }

  try {
    const allTracked = getAllCarTrackingData();

    const carStars: Record<string, number> = {};
    const ownedCars: string[] = [];
    const goldMaxedCars: string[] = [];
    const keyCarsOwned: string[] = [];

    // ✅ ADD: blueprint payload accumulator
    const blueprintsByCar: Record<string, Record<number, number>> = {};

    for (const [normalizedKey, data] of Object.entries(allTracked)) {
      const label =
        (opts.labelByKey && opts.labelByKey.get(normalizedKey)) ||
        fallbackLabelFromKey(normalizedKey);

      if (typeof data.stars === 'number' && data.stars > 0) {
        const stars = Math.min(6, Math.max(1, data.stars));
        carStars[label] = stars;
      }
      if (data.owned) ownedCars.push(label);
      if (data.goldMaxed) goldMaxedCars.push(label);
      if (data.keyObtained) keyCarsOwned.push(label);

      // ✅ ADD: include blueprint tracking if present
      const ownedByStar = data.blueprints?.ownedByStar;
      if (ownedByStar && Object.keys(ownedByStar).length > 0) {
        blueprintsByCar[label] = ownedByStar;
      }
    }

    const gl = readGarageLevelSnapshot();

    const payload: ProgressPayload = {
      carStars,
      ownedCars: uniq(ownedCars),
      goldMaxedCars: uniq(goldMaxedCars),
      keyCarsOwned: uniq(keyCarsOwned),

      xp: gl.xp,

      // New fields – backend is ready for these
      currentGarageLevel: gl.currentGarageLevel,
      currentGLXp: gl.currentGLXp,
      garageLevelTrackerMode: gl.garageLevelTrackerMode,

      // ✅ ADD: only send if non-empty
      blueprintsByCar: Object.keys(blueprintsByCar).length > 0 ? blueprintsByCar : undefined,
    };

    const isEmpty =
      Object.keys(carStars).length === 0 &&
      payload.ownedCars.length === 0 &&
      payload.goldMaxedCars.length === 0 &&
      payload.keyCarsOwned.length === 0 &&
      gl.xp === 0;
    // ✅ NOTE: intentionally NOT changing the existing empty-snapshot behavior.
    // If you want blueprints alone to trigger sync, we can add it later,
    // but that would be a behavior change. So we leave it as-is.

    if (isEmpty) {
      console.warn('⏭️ Skip sync: empty snapshot (protected)');
      return { success: true, skipped: true as const };
    }

    const res = await fetch(`${USER_API_BASE}/api/users/save-progress`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    if (!res.ok) {
      const contentType = res.headers.get('content-type') ?? '';
      let msg = `HTTP ${res.status}`;

      if (contentType.includes('application/json')) {
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
      err instanceof DOMException && err.name === 'AbortError'
        ? `Request timed out after ${timeoutMs}ms`
        : err instanceof Error
          ? err.message
          : 'Sync failed due to unknown error.';
    return { success: false, message };
  } finally {
    clearTimeout(timer);
  }
}