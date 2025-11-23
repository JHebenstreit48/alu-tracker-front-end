// src/hooks/GarageLevels/useGarageLevelStats.ts

import { useMemo } from 'react';
import { useGarageLevels } from '@/hooks/GarageLevels/useGarageLevels';

export const MAX_LEVEL = 60;

export interface GarageLevelStats {
  loading: boolean;
  error: string | null;
  currentLevel: number;
  currentXp: number;
  nextLevel: number | null;
  xpToNext: number;
  xpWithinLevelPercent: number; // 0–100 within the *current* level
  levelPercent: number;         // 0–100 based purely on level vs MAX_LEVEL
  overallPercent: number;       // 0–100 based on XP vs XP for MAX_LEVEL
}

function readLocalLevel(): number {
  if (typeof window === 'undefined') return 1;
  const raw = window.localStorage.getItem('currentGarageLevel');
  const n = raw ? Number(raw) : NaN;
  return Number.isFinite(n) ? n : 1;
}

function readLocalXp(): number {
  if (typeof window === 'undefined') return 0;
  const raw = window.localStorage.getItem('currentXp');
  if (!raw) return 0;
  const cleaned = raw.replace(/,/g, '');
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : 0;
}

export function useGarageLevelStats(): GarageLevelStats {
  const { levels, loading, error } = useGarageLevels();

  return useMemo(() => {
    // loading / empty safeguard
    if (loading || levels.length === 0) {
      return {
        loading,
        error,
        currentLevel: 1,
        currentXp: 0,
        nextLevel: 2,
        xpToNext: 0,
        xpWithinLevelPercent: 0,
        levelPercent: 0,
        overallPercent: 0,
      };
    }

    const localLevel = readLocalLevel();
    const localXp = readLocalXp();

    // Clamp level between 1 and MAX_LEVEL
    const currentLevel = Math.min(Math.max(localLevel || 1, 1), MAX_LEVEL);

    // XP threshold for max level
    const maxLevelEntry = levels.find((l) => l.GarageLevelKey === MAX_LEVEL);
    const maxXpThreshold = maxLevelEntry?.xp ?? 0;

    // Clamp XP between 0 and max threshold (if we know it)
    const currentXp =
      maxXpThreshold > 0
        ? Math.min(Math.max(localXp, 0), maxXpThreshold)
        : Math.max(localXp, 0);

    // Entries for current + next levels
    const currentEntry = levels.find((l) => l.GarageLevelKey === currentLevel);
    const nextEntry = levels.find((l) => l.GarageLevelKey === currentLevel + 1);

    const currentThreshold = currentEntry?.xp ?? 0;

    // If at MAX_LEVEL, treat nextThreshold == currentThreshold
    const nextThreshold =
      currentLevel >= MAX_LEVEL
        ? currentThreshold
        : nextEntry?.xp ?? currentThreshold;

    // XP remaining to next level (0 at or beyond max)
    const xpToNext =
      currentLevel >= MAX_LEVEL
        ? 0
        : Math.max(nextThreshold - currentXp, 0);

    // Progress within current level (0–100 between thresholds N and N+1)
    const levelRange = Math.max(nextThreshold - currentThreshold, 1);
    const xpWithinLevelRaw = Math.max(
      Math.min(currentXp, nextThreshold) - currentThreshold,
      0
    );
    const xpWithinLevelPercent = (xpWithinLevelRaw / levelRange) * 100;

    // Level-based progress purely by level index
    const levelPercent = (currentLevel / MAX_LEVEL) * 100;

    // Overall progress by XP vs XP required for max level
    const overallPercent =
      maxXpThreshold > 0
        ? Math.min((currentXp / maxXpThreshold) * 100, 100)
        : levelPercent;

    return {
      loading: false,
      error,
      currentLevel,
      currentXp,
      nextLevel: currentLevel >= MAX_LEVEL ? null : currentLevel + 1,
      xpToNext,
      xpWithinLevelPercent,
      levelPercent,
      overallPercent,
    };
  }, [levels, loading, error]);
}