export type FavoritesMap = Record<string, true>;
const FAVORITES_KEY = "carFavorites";

const API_BASE = String(import.meta.env.VITE_AUTH_API_URL || "").replace(/\/+$/, "");
const url = (p: string) => `${API_BASE}${p}`;

const normalizeKey = (k: string) => k.trim().toLowerCase();
const normalizeList = (arr: string[]) => arr.map(normalizeKey);

function getToken(): string | null {
  return (
    localStorage.getItem("authToken") ||
    sessionStorage.getItem("authToken") ||
    localStorage.getItem("token") ||
    sessionStorage.getItem("token") ||
    null
  );
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

async function getServerList(token: string): Promise<string[]> {
  const r = await fetch(url("/api/users/favorites"), {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!r.ok) throw new Error(`GET /favorites ${r.status}`);
  const list = (await r.json()) as string[];
  return Array.isArray(list) ? normalizeList(list) : [];
}

async function putServerList(token: string, keys: string[]): Promise<void> {
  const r = await fetch(url("/api/users/favorites"), {
    method: "PUT",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(normalizeList(keys)),
  });
  if (!r.ok) throw new Error(`PUT /favorites ${r.status} ${await r.text().catch(()=> "")}`);
}

export async function loadFavorites(): Promise<FavoritesMap> {
  const local = readLocal();

  const token = getToken();
  if (!token || !API_BASE) return local;

  try {
    const server = await getServerList(token);
    const merged: FavoritesMap = { ...local };
    for (const k of server) merged[k] = true;
    writeLocal(merged);
    return merged;
  } catch {
    return local;
  }
}

export async function saveFavorites(next: FavoritesMap): Promise<void> {
  // local first for snappy UI
  writeLocal(next);
  window.dispatchEvent(new Event("favorites:updated"));

  const token = getToken();
  if (!token || !API_BASE) return;

  try {
    // 1) push snapshot
    const keys = Object.keys(next);
    await putServerList(token, keys);

    // 2) pull server truth and reconcile local (handles retries/out-of-order)
    const server = await getServerList(token);
    const reconciled: FavoritesMap = {};
    for (const k of server) reconciled[k] = true;

    writeLocal(reconciled);
    window.dispatchEvent(new Event("favorites:updated")); // notify any listeners
  } catch {
    // silent: local already reflects user's intent; server can catch up later
  }
}

export async function toggleFavorite(carKey: string): Promise<FavoritesMap> {
  const map = await loadFavorites();
  const key = normalizeKey(carKey);
  const next = { ...map };
  if (next[key]) delete next[key]; else next[key] = true;
  await saveFavorites(next);
  return next;
}