type ServerProgress = {
  xp?: number;
  currentGLXp?: number;
  currentGarageLevel?: number;
  garageLevelTrackerMode?: string;
};

type ProgressResponse = {
  progress?: ServerProgress;
};

function isObject(u: unknown): u is Record<string, unknown> {
  return typeof u === "object" && u !== null;
}

function safeParseJSON(text: string): unknown {
  try {
    return text ? JSON.parse(text) : {};
  } catch {
    return {};
  }
}

const USER_API_BASE = (import.meta.env.VITE_USER_API_URL || "").replace(/\/+$/, "");

export async function hydrateGarageLevelsFromAccount(
  token: string,
  opts: { timeoutMs?: number } = {}
): Promise<void> {
  const timeoutMs = typeof opts.timeoutMs === "number" ? opts.timeoutMs : 15000;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  if (!USER_API_BASE) return;

  try {
    const url = `${USER_API_BASE}/api/users/get-progress`;
    const res = await fetch(url, {
      method: "GET",
      credentials: "include",
      headers: { Authorization: `Bearer ${token}` },
      signal: controller.signal,
    });

    const rawText = await res.text();
    const dataUnknown = safeParseJSON(rawText);

    if (!res.ok) return;
    if (!isObject(dataUnknown)) return;

    const progress = (dataUnknown as ProgressResponse).progress;
    if (!progress) return;

    // Prefer explicit GL XP, fallback to legacy xp
    const xpRaw = progress.currentGLXp ?? progress.xp;
    const levelRaw = progress.currentGarageLevel;
    const modeRaw = progress.garageLevelTrackerMode;

    // Only write if server actually has values
    const xp = Number(xpRaw);
    if (Number.isFinite(xp)) localStorage.setItem("currentXp", String(xp));

    const level = Number(levelRaw);
    if (Number.isFinite(level) && level > 0) {
      localStorage.setItem("currentGarageLevel", String(level));
    }

    if (typeof modeRaw === "string" && modeRaw.trim() !== "") {
      localStorage.setItem("garageLevelTrackerMode", modeRaw);
    }
  } catch {
    // silent: GL hydration shouldn't break login
  } finally {
    clearTimeout(timer);
  }
}