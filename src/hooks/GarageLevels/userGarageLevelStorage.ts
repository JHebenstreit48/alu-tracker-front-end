export type GarageLevelSyncState = {
  currentGarageLevel: number;
  currentGLXp: number;
  garageLevelTrackerMode: string;
};

export const DEFAULT_GL_STATE: GarageLevelSyncState = {
  currentGarageLevel: 1,
  currentGLXp: 0,
  // change if your tracker uses a different default mode
  garageLevelTrackerMode: "default",
};

const LS_KEYS = {
  level: "currentGarageLevel",
  xp: "currentXp", // existing key for XP
  mode: "garageLevelTrackerMode",
};

function safeNumber(raw: string | null, fallback: number): number {
  if (!raw) return fallback;
  const cleaned = raw.replace(/,/g, "");
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : fallback;
}

export function readGarageLevelsFromLocalStorage():
  | GarageLevelSyncState
  | null {
  if (typeof window === "undefined") return null;

  const lvlRaw = window.localStorage.getItem(LS_KEYS.level);
  const xpRaw = window.localStorage.getItem(LS_KEYS.xp);
  const modeRaw = window.localStorage.getItem(LS_KEYS.mode);

  if (!lvlRaw && !xpRaw && !modeRaw) return null;

  const level = safeNumber(lvlRaw, DEFAULT_GL_STATE.currentGarageLevel);
  const xp = safeNumber(xpRaw, DEFAULT_GL_STATE.currentGLXp);
  const mode = modeRaw || DEFAULT_GL_STATE.garageLevelTrackerMode;

  return {
    currentGarageLevel: level > 0 ? level : 1,
    currentGLXp: xp >= 0 ? xp : 0,
    garageLevelTrackerMode: mode,
  };
}

export function writeGarageLevelsToLocalStorage(
  state: GarageLevelSyncState
): void {
  if (typeof window === "undefined") return;

  window.localStorage.setItem(
    LS_KEYS.level,
    String(state.currentGarageLevel || 1)
  );
  window.localStorage.setItem(LS_KEYS.xp, String(state.currentGLXp || 0));
  window.localStorage.setItem(
    LS_KEYS.mode,
    state.garageLevelTrackerMode || DEFAULT_GL_STATE.garageLevelTrackerMode
  );
}

export function isDefaultGarageLevelState(
  state: GarageLevelSyncState
): boolean {
  return (
    state.currentGarageLevel === DEFAULT_GL_STATE.currentGarageLevel &&
    state.currentGLXp === DEFAULT_GL_STATE.currentGLXp &&
    state.garageLevelTrackerMode === DEFAULT_GL_STATE.garageLevelTrackerMode
  );
}