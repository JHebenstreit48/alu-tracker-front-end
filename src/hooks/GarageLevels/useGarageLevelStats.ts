import { useGarageLevels } from '@/hooks/GarageLevels/useGarageLevels';

export interface GarageLevelStats {
  loading: boolean;
  error?: string;
  currentLevel: number;
  currentXp: number;
  nextLevel: number | null;
  xpToNext: number;
  xpWithinLevelPercent: number; // 0–100, progress inside current level
  levelPercent: number;         // 0–100, currentLevel / maxLevel
  overallPercent: number;       // 0–100, overall progress toward max
}

const MAX_LEVEL = 60;
const LEVEL_KEY = 'currentGarageLevel';
const XP_KEY = 'currentXp';

function safeNumber(raw: string | null, fallback = 0): number {
  if (!raw) return fallback;
  const cleaned = raw.replace(/,/g, '');
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : fallback;
}

export function useGarageLevelStats(): GarageLevelStats {
  const { levels, loading, error } = useGarageLevels();

  // ---- read localStorage (same keys as GarageLevelTracker) ----
  let storedLevel = 1;
  let storedXp = 0;

  if (typeof window !== 'undefined') {
    storedLevel = safeNumber(localStorage.getItem(LEVEL_KEY), 1);
    storedXp = safeNumber(localStorage.getItem(XP_KEY), 0);
  }

  // Clamp level into a sane range
  const currentLevel = Math.min(Math.max(storedLevel || 1, 1), MAX_LEVEL);
  const currentXp = Math.max(storedXp, 0);

  // ---- find XP requirement for THIS level (same logic as Tracker.tsx) ----
  const nextLevelDoc = levels.find(
    (lvl) => lvl.GarageLevelKey === currentLevel + 1
  );
  const xpRequiredForCurrent = nextLevelDoc?.xp ?? 0;

  // XP remaining to next level
  const xpToNext =
    xpRequiredForCurrent > 0
      ? Math.max(xpRequiredForCurrent - currentXp, 0)
      : 0;

  // % inside the current level (0–100)
  const xpWithinLevelPercent =
    xpRequiredForCurrent > 0
      ? Math.min((currentXp / xpRequiredForCurrent) * 100, 100)
      : 0;

  // Simple “what % of max level am I at?” based on level number only
  const levelPercent = (currentLevel / MAX_LEVEL) * 100;

  // Overall progress: treat each level as one “step”, add fractional part
  const levelFraction =
    xpRequiredForCurrent > 0 ? currentXp / xpRequiredForCurrent : 0;

  // Level 1 with 0 xp  -> 0%
  // Level 60 (or above) -> 100%
  const normalized =
    currentLevel >= MAX_LEVEL
      ? MAX_LEVEL - 1
      : (currentLevel - 1) + levelFraction;

  const overallPercent =
    ((normalized / (MAX_LEVEL - 1)) * 100) > 100
      ? 100
      : (normalized / (MAX_LEVEL - 1)) * 100;

  return {
    loading,
    error: error ?? undefined,
    currentLevel,
    currentXp,
    nextLevel: currentLevel < MAX_LEVEL ? currentLevel + 1 : null,
    xpToNext,
    xpWithinLevelPercent,
    levelPercent,
    overallPercent,
  };
}