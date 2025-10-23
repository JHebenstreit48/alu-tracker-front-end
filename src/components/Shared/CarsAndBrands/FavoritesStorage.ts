export type FavoritesMap = Record<string, true>;
const FAVORITES_KEY = "carFavorites";

// Use your Render API base; Netlify must have this env var set at build time
const API_BASE = String(import.meta.env.VITE_AUTH_API_URL || "").replace(/\/+$/, "");
const url = (p: string) => `${API_BASE}${p}`;

// Be lenient about where the token might be stored
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

async function fetchJson(input: RequestInfo, init?: RequestInit) {
  const res = await fetch(input, init);
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status}: ${text || "(no body)"}`);
  }
  return res.json();
}

/** Load: local first, then merge with server (if logged in). */
export async function loadFavorites(): Promise<FavoritesMap> {
  const local = readLocal();
  const token = getToken();
  if (!token || !API_BASE) return local;

  try {
    const list = await fetchJson(url("/api/users/favorites"), {
      headers: { Authorization: `Bearer ${token}` },
    }) as unknown as string[];

    // merge server -> local (server is source of truth when logged in)
    const merged: FavoritesMap = { ...local };
    for (const k of Array.isArray(list) ? list : []) merged[k] = true;
    writeLocal(merged);
    return merged;
  } catch {
    // If server call fails, stick to local
    return local;
  }
}

/** Save: write local immediately; if logged in, PUT the full snapshot to the server. */
export async function saveFavorites(next: FavoritesMap): Promise<void> {
  writeLocal(next);
  window.dispatchEvent(new Event("favorites:updated"));

  const token = getToken();
  if (!token || !API_BASE) return;

  const snapshot = Object.keys(next).sort(); // stable order

  try {
    await fetch(url("/api/users/favorites"), {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(snapshot),
    });
  } catch {
    // local already updated; user stays consistent visually
  }
}

export async function toggleFavorite(carKey: string): Promise<FavoritesMap> {
  const map = await loadFavorites();           // hydrate local (and merge with server if possible)
  const next = { ...map };
  if (next[carKey]) delete next[carKey]; else next[carKey] = true;
  await saveFavorites(next);                   // PUT snapshot if logged in
  return next;
}