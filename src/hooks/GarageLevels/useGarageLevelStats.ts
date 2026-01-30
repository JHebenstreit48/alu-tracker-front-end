import { useEffect } from "react";
import { useGarageLevels } from "@/hooks/GarageLevels/useGarageLevels";
import { useUserGarageLevelSync } from "@/hooks/GarageLevels/useUserGarageLevelSync";
import { useGarageLevelLocalSnapshot } from "@/hooks/Tracking/useGarageLevelLocalSnapshot";
import type { GarageLevelStats } from "@/types/GarageLevels/garageLevels";

const MAX_LEVEL = 60;

export function useGarageLevelStats(): GarageLevelStats {
  const { levels, loading: levelsLoading, error } = useGarageLevels();

  // Still run Firebase → localStorage → defaults logic
  const { loading: glLoading } = useUserGarageLevelSync();

  // Always render from localStorage snapshot (reactive)
  const { currentGarageLevel, currentXp, refresh } = useGarageLevelLocalSnapshot();

  // When sync finishes, refresh snapshot so same-tab updates show immediately
  useEffect(() => {
    if (!glLoading) refresh();
  }, [glLoading, refresh]);

  const loading = levelsLoading || glLoading;

  const currentLevel = Math.min(Math.max(currentGarageLevel || 1, 1), MAX_LEVEL);
  const xp = Math.max(currentXp || 0, 0);

  const nextLevelDoc = levels.find(
    (lvl) => lvl.GarageLevelKey === currentLevel + 1
  );
  const xpRequiredForCurrent = nextLevelDoc?.xp ?? 0;

  const xpToNext =
    xpRequiredForCurrent > 0 ? Math.max(xpRequiredForCurrent - xp, 0) : 0;

  const xpWithinLevelPercent =
    xpRequiredForCurrent > 0
      ? Math.min((xp / xpRequiredForCurrent) * 100, 100)
      : 0;

  const levelPercent = (currentLevel / MAX_LEVEL) * 100;

  const levelFraction =
    xpRequiredForCurrent > 0 ? xp / xpRequiredForCurrent : 0;

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
    currentXp: xp,
    nextLevel: currentLevel < MAX_LEVEL ? currentLevel + 1 : null,
    xpToNext,
    xpWithinLevelPercent,
    levelPercent,
    overallPercent,
  };
}