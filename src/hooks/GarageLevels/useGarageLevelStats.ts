import { useEffect, useMemo, useState } from 'react';
import { useGarageLevels } from '@/hooks/GarageLevels/useGarageLevels';
import type { GarageLevelsInterface } from '@/interfaces/GarageLevels';

const MAX_LEVEL = 60;

export interface GarageLevelStats {
  loading: boolean;
  error: string | null;
  currentLevel: number;
  currentXp: number;
  nextLevel: number | null;
  xpToNext: number;
  xpWithinLevelPercent: number;
  levelPercent: number;
  overallPercent: number;
}

function parseXp(raw: string | null): number {
  if (!raw) return 0;
  const cleaned = raw.replace(/,/g, '');
  const n = Number(cleaned);
  return Number.isFinite(n) && n >= 0 ? n : 0;
}

export function useGarageLevelStats(): GarageLevelStats {
  const { levels, loading, error } = useGarageLevels();

  const [localLevel, setLocalLevel] = useState<number>(() => {
    const raw = localStorage.getItem('currentGarageLevel');
    const n = raw ? Number(raw) : 1;
    return Number.isFinite(n) && n > 0 ? n : 1;
  });

  const [localXp, setLocalXp] = useState<number>(() => {
    const raw = localStorage.getItem('currentXp');
    return parseXp(raw);
  });

  // Listen for changes from the GarageLevels page (or other tabs)
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'currentGarageLevel' && e.newValue != null) {
        const n = Number(e.newValue);
        if (Number.isFinite(n)) setLocalLevel(n);
      }
      if (e.key === 'currentXp' && e.newValue != null) {
        setLocalXp(parseXp(e.newValue));
      }
    };

    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  return useMemo(() => {
    const currentLevel = Math.min(Math.max(localLevel || 1, 1), MAX_LEVEL);
    const currentXp = localXp;

    // If we don't have levels yet, still return a sane object
    if (!levels || levels.length === 0) {
      return {
        loading,
        error: error ?? null,
        currentLevel,
        currentXp,
        nextLevel: null,
        xpToNext: 0,
        xpWithinLevelPercent: 0,
        levelPercent: (currentLevel / MAX_LEVEL) * 100,
        overallPercent: (currentLevel / MAX_LEVEL) * 100,
      };
    }

    const sorted = [...levels].sort(
      (a: GarageLevelsInterface, b: GarageLevelsInterface) =>
        a.GarageLevelKey - b.GarageLevelKey,
    );

    const currentLevelData =
      sorted.find((l) => l.GarageLevelKey === currentLevel) ?? sorted[0];

    const nextLevelData =
      sorted.find((l) => l.GarageLevelKey === currentLevel + 1) ?? null;

    const currentLevelFloorXp = currentLevelData?.xp ?? 0;
    const nextLevelXp = nextLevelData?.xp ?? currentLevelFloorXp;

    let xpToNext = 0;
    let withinPercent = 0;

    if (nextLevelXp > currentLevelFloorXp) {
      const span = nextLevelXp - currentLevelFloorXp;
      const clampedXp = Math.min(
        Math.max(currentXp, currentLevelFloorXp),
        nextLevelXp,
      );
      withinPercent = ((clampedXp - currentLevelFloorXp) / span) * 100;
      xpToNext = Math.max(nextLevelXp - currentXp, 0);
    }

    const maxXp = sorted[sorted.length - 1]?.xp ?? 0;
    const overallPercent =
      maxXp > 0
        ? Math.min((currentXp / maxXp) * 100, 100)
        : (currentLevel / MAX_LEVEL) * 100;

    return {
      loading,
      error: error ?? null,
      currentLevel,
      currentXp,
      nextLevel: nextLevelData ? nextLevelData.GarageLevelKey : null,
      xpToNext,
      xpWithinLevelPercent: withinPercent,
      levelPercent: (currentLevel / MAX_LEVEL) * 100,
      overallPercent,
    };
  }, [localLevel, localXp, levels, loading, error]);
}