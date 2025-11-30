import { useGarageLevels } from "@/hooks/GarageLevels/useGarageLevels";
import { useUserGarageLevelSync } from "@/hooks/GarageLevels/useUserGarageLevelSync";
import type { GarageLevelStats } from "@/types/GarageLevels/garageLevels";

const MAX_LEVEL = 60;

export function useGarageLevelStats(): GarageLevelStats {
  const { levels, loading: levelsLoading, error } = useGarageLevels();
  const {
    currentGarageLevel,
    currentGLXp,
    loading: glLoading,
  } = useUserGarageLevelSync();

  const loading = levelsLoading || glLoading;

  // Clamp level into a sane range
  const currentLevel = Math.min(
    Math.max(currentGarageLevel || 1, 1),
    MAX_LEVEL
  );
  const currentXp = Math.max(currentGLXp || 0, 0);

  // ---- find XP requirement for THIS level (same logic as before) ----
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
    (normalized / (MAX_LEVEL - 1)) * 100 > 100
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