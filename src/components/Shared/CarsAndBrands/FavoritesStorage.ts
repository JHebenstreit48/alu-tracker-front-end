export type FavoritesMap = Record<string, true>;
const FAVORITES_KEY = "carFavorites";

const API_BASE = String(import.meta.env.VITE_AUTH_API_URL || "").replace(/\/+$/, ""); // no trailing slash

const getToken = () =>
  localStorage.getItem("authToken") || sessionStorage.getItem("authToken");

function apiUrl(path: string) {
  // path should start with "/"
  return `${API_BASE}${path}`;
}

function readLocal(): FavoritesMap {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    return raw ? (JSON.parse(raw) as FavoritesMap) : {};
  } catch {
    return {};
  }
}

function writeLocal(map: FavoritesMap): void {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(map));
}

export async function loadFavorites(): Promise<FavoritesMap> {
  const local = readLocal();

  const token = getToken();
  if (!token) return local;

  try {
    const res = await fetch(apiUrl("/api/users/get-progress"), {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("get-progress failed");
    const data = await res.json();
    const remote: string[] = data?.progress?.favorites ?? [];

    const merged: FavoritesMap = { ...local };
    for (const k of remote) merged[k] = true;
    writeLocal(merged);
    return merged;
  } catch {
    return local;
  }
}

export async function saveFavorites(next: FavoritesMap): Promise<void> {
  const prev = readLocal();
  writeLocal(next);
  window.dispatchEvent(new Event("favorites:updated"));

  const token = getToken();
  if (!token) return; // not logged in → local-only

  // compute delta
  const prevKeys = new Set(Object.keys(prev));
  const nextKeys = new Set(Object.keys(next));

  const favoritesAdd: string[] = [];
  const favoritesRemove: string[] = [];

  for (const k of nextKeys) if (!prevKeys.has(k)) favoritesAdd.push(k);
  for (const k of prevKeys) if (!nextKeys.has(k)) favoritesRemove.push(k);

  if (!favoritesAdd.length && !favoritesRemove.length) return;

  try {
    await fetch(apiUrl("/api/users/save-progress"), {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ favoritesAdd, favoritesRemove }),
    });
  } catch {
    // local already saved; server can reconcile on next change
  }
}

export async function toggleFavorite(carKey: string): Promise<FavoritesMap> {
  const map = await loadFavorites();
  const next = { ...map };
  if (next[carKey]) delete next[carKey];
  else next[carKey] = true;
  await saveFavorites(next);
  return next;
}