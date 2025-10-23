export type FavoritesMap = Record<string, true>;
const FAVORITES_KEY = "carFavorites";

const API_BASE = String(import.meta.env.VITE_AUTH_API_URL || "").replace(/\/+$/, "");
const url = (p: string) => `${API_BASE}${p}`;

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

async function fetchJsonOrThrow(input: RequestInfo, init?: RequestInit) {
  const res = await fetch(input, init);
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status} ${text}`);
  }
  return res.json();
}

export async function loadFavorites(): Promise<FavoritesMap> {
  const local = readLocal();
  const token = getToken();
  if (!token || !API_BASE) return local;

  try {
    const list = await fetchJsonOrThrow(url("/api/users/favorites"), {
      headers: { Authorization: `Bearer ${token}` },
    }) as unknown as string[];

    const merged: FavoritesMap = { ...local };
    for (const k of Array.isArray(list) ? list : []) merged[k] = true;
    writeLocal(merged);
    return merged;
  } catch (err) {
    console.warn("[favorites] GET failed:", err);
    return local;
  }
}

export async function saveFavorites(next: FavoritesMap): Promise<void> {
  writeLocal(next);
  window.dispatchEvent(new Event("favorites:updated"));

  const token = getToken();
  if (!token || !API_BASE) return;

  const snapshot = Object.keys(next).sort();
  try {
    const res = await fetch(url("/api/users/favorites"), {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(snapshot),
    });
    if (!res.ok) {
      const txt = await res.text().catch(() => "");
      console.error("[favorites] PUT failed:", res.status, txt);
    }
  } catch (err) {
    console.error("[favorites] PUT error:", err);
  }
}

export async function toggleFavorite(carKey: string): Promise<FavoritesMap> {
  const map = await loadFavorites();
  const key = carKey.trim().toLowerCase();
  const next = { ...map };
  if (next[key]) delete next[key]; else next[key] = true;
  await saveFavorites(next);
  return next;
}