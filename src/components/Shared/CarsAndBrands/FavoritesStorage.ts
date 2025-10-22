export type FavoritesMap = Record<string, true>;
const FAVORITES_KEY = "carFavorites";

declare global {
  interface Window {
    ALU_LOAD_FAVORITES?: () => Promise<string[]>;
    ALU_SYNC_FAVORITES?: (favorites: string[]) => Promise<void>;
  }
}

function readLocal(): FavoritesMap {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    return raw ? (JSON.parse(raw) as FavoritesMap) : {};
  } catch { return {}; }
}

function writeLocal(map: FavoritesMap): void {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(map));
}

export async function loadFavorites(): Promise<FavoritesMap> {
  const local = readLocal();
  if (typeof window.ALU_LOAD_FAVORITES !== "function") return local;
  try {
    const remote = await window.ALU_LOAD_FAVORITES();
    const merged: FavoritesMap = { ...local };
    for (const k of remote) merged[k] = true;
    writeLocal(merged);
    return merged;
  } catch {
    return local;
  }
}

export async function saveFavorites(next: FavoritesMap): Promise<void> {
  writeLocal(next);
  window.dispatchEvent(new Event("favorites:updated"));
  if (typeof window.ALU_SYNC_FAVORITES === "function") {
    try { await window.ALU_SYNC_FAVORITES(Object.keys(next)); } catch { /* local already saved */ }
  }
}

export async function toggleFavorite(carKey: string): Promise<FavoritesMap> {
  const map = await loadFavorites();
  const next = { ...map };
  if (next[carKey]) delete next[carKey]; else next[carKey] = true;
  await saveFavorites(next);
  return next;
}