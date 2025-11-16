export type FavoritesMap = Record<string, true>;
const FAVORITES_KEY = "carFavorites";

// User data (progress/favorites) now lives on the user API (Cloud Function)
const API_BASE = String(import.meta.env.VITE_USER_API_URL || "").replace(/\/+$/, "");
const url = (p: string) => `${API_BASE}${p}`;

// Normalize to the canonical format you use across the app (underscores, lowercase, no dots)
const normalizeKey = (k: string) =>
  k
    .trim()
    .toLowerCase()
    .replace(/\./g, "") // strip dots (your generator does this)
    .replace(/-/g, "_") // convert hyphens -> underscores
    .replace(/__+/g, "_"); // collapse doubles

const listToMap = (keys: string[]): FavoritesMap => {
  const m: FavoritesMap = {};
  for (const raw of keys) m[normalizeKey(raw)] = true;
  return m;
};

function readLocal(): FavoritesMap {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    const parsed = raw ? (JSON.parse(raw) as Record<string, true>) : {};
    // MIGRATION: normalize **existing** local keys so old hyphen keys don’t break UI
    const migrated: FavoritesMap = {};
    for (const k of Object.keys(parsed)) migrated[normalizeKey(k)] = true;
    if (raw && JSON.stringify(parsed) !== JSON.stringify(migrated)) {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(migrated));
    }
    return migrated;
  } catch {
    return {};
  }
}

function writeLocal(map: FavoritesMap): void {
  // Always write normalized
  const normalized = listToMap(Object.keys(map));
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(normalized));
}

function getToken(): string | null {
  return (
    localStorage.getItem("authToken") ||
    sessionStorage.getItem("authToken") ||
    localStorage.getItem("token") ||
    sessionStorage.getItem("token") ||
    null
  );
}

async function getServerList(token: string): Promise<string[]> {
  if (!API_BASE) return [];
  const r = await fetch(url("/api/users/favorites"), {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!r.ok) throw new Error(`GET /favorites ${r.status}`);
  const list = (await r.json()) as unknown;
  return Array.isArray(list) ? list.map(normalizeKey) : [];
}

async function putServerList(token: string, keys: string[]): Promise<void> {
  if (!API_BASE) return;
  const payload = keys.map(normalizeKey).sort();
  const r = await fetch(url("/api/users/favorites"), {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  if (!r.ok) {
    throw new Error(
      `PUT /favorites ${r.status} ${await r.text().catch(() => "")}`
    );
  }
}

export async function loadFavorites(): Promise<FavoritesMap> {
  const local = readLocal();
  const token = getToken();
  if (!token || !API_BASE) return local;

  try {
    // Server = source of truth; merge into local (helps cross-device)
    const server = await getServerList(token);
    const merged = { ...local, ...listToMap(server) };
    writeLocal(merged);
    return merged;
  } catch {
    return local;
  }
}

export async function saveFavorites(next: FavoritesMap): Promise<void> {
  // Optimistic: write local first, notify listeners
  writeLocal(next);
  window.dispatchEvent(new Event("favorites:updated"));

  const token = getToken();
  if (!token || !API_BASE) return;

  try {
    // 1) Push snapshot
    await putServerList(token, Object.keys(next));
    // 2) Pull server truth and *replace* local (prevents any drift/out-of-order)
    const server = await getServerList(token);
    const reconciled = listToMap(server);
    writeLocal(reconciled);
    window.dispatchEvent(new Event("favorites:updated"));
  } catch {
    // Keep optimistic local; server can catch up later
  }
}

export async function toggleFavorite(carKey: string): Promise<FavoritesMap> {
  const map = await loadFavorites();
  const key = normalizeKey(carKey);
  const next = { ...map };
  if (next[key]) delete next[key];
  else next[key] = true;
  await saveFavorites(next);
  return next;
}