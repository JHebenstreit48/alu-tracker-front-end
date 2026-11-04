export type ViewCounts = Record<string, number>;

const CAR_VIEWS_KEY = 'carViews';
export const LOCAL_VIEWS_EVENT = 'localViewsUpdated';
export const LOCAL_VIEWS_STORAGE_KEY = CAR_VIEWS_KEY;
export const ACCOUNT_VIEWS_PING_KEY = 'carViewsAccountPing';

export function sanitizeViewCounts(value: unknown): ViewCounts {
  if (!value || typeof value !== 'object') return {};
  const out: ViewCounts = {};
  for (const [key, count] of Object.entries(value as Record<string, unknown>)) {
    if (typeof count === 'number' && Number.isFinite(count) && count > 0) out[key] = count;
  }
  return out;
}

export function readLocalCarViews(): ViewCounts {
  try {
    return sanitizeViewCounts(JSON.parse(localStorage.getItem(CAR_VIEWS_KEY) ?? '{}'));
  } catch {
    return {};
  }
}

export function notifyViewsChanged(): void {
  window.dispatchEvent(new Event(LOCAL_VIEWS_EVENT));
  try {
    localStorage.setItem(ACCOUNT_VIEWS_PING_KEY, String(Date.now()));
  } catch {
    return;
  }
}

export function incrementLocalCarView(carKey: string): void {
  const counts = readLocalCarViews();
  counts[carKey] = (counts[carKey] ?? 0) + 1;
  try {
    localStorage.setItem(CAR_VIEWS_KEY, JSON.stringify(counts));
    window.dispatchEvent(new Event(LOCAL_VIEWS_EVENT));
  } catch {
    return;
  }
}