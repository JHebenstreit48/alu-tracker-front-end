import { useEffect, useMemo, useState } from 'react';
import {
  generateCarKey,
  getCarTrackingData,
  setCarTrackingData,
} from '@/utils/shared/StorageUtils';
import type { BlueprintsRow } from '@/types/CarDetails/Blueprints';
import { useAutoSyncDependency } from '@/hooks/UserDataSync/useAutoSync';

export function useBlueprintTracker(params: {
  brand: string;
  model: string;
  isKeyCar: boolean;
  rows: BlueprintsRow[];
}) {
  const { brand, model, rows } = params;

  const maxStars = rows[rows.length - 1]?.star ?? 0;
  const carKey = useMemo(() => generateCarKey(brand, model), [brand, model]);

  // Initial snapshot (boot only)
  const snapshot = useMemo(() => getCarTrackingData(carKey), [carKey]);
  const currentStars = typeof snapshot.stars === 'number' ? snapshot.stars : 0;
  const goldMaxed = !!snapshot.goldMaxed;

  const [ownedByStar, setOwnedByStar] = useState<Record<number, number>>(
    (snapshot.blueprints?.ownedByStar ?? {}) as Record<number, number>
  );

  // Sync when navigating between cars
  useEffect(() => {
    const fresh = getCarTrackingData(carKey);
    setOwnedByStar((fresh.blueprints?.ownedByStar ?? {}) as Record<number, number>);
  }, [carKey]);

  const done = goldMaxed || currentStars >= maxStars;

  /**
   * ✅ Correct editable row logic
   * - Done => no input
   * - 0 stars => input on 1⭐ (unlocking)
   * - otherwise => input on next star (currentStars + 1)
   */
  const targetStar = done
    ? -1
    : currentStars === 0
      ? 1
      : Math.min(currentStars + 1, maxStars);

  /**
   * ✅ Auto-complete stars already achieved
   * If the car is already at N stars, rows <= N are satisfied.
   */
  useEffect(() => {
    if (currentStars <= 0) return;

    setOwnedByStar((prev) => {
      const next = { ...prev };
      let changed = false;

      rows.forEach((r) => {
        if (r.star <= currentStars && typeof r.value === 'number') {
          if (next[r.star] !== r.value) {
            next[r.star] = r.value;
            changed = true;
          }
        }
      });

      if (!changed) return prev;

      const current = getCarTrackingData(carKey);
      setCarTrackingData(carKey, {
        ...current,
        blueprints: {
          ...(current.blueprints ?? {}),
          ownedByStar: next,
        },
      });

      return next;
    });
  }, [currentStars, rows, carKey]);

  /**
   * ✅ Auto-complete all when done
   */
  useEffect(() => {
    if (!done) return;

    const fulfilled: Record<number, number> = {};
    rows.forEach((r) => {
      if (typeof r.value === 'number') {
        fulfilled[r.star] = r.value;
      }
    });

    setOwnedByStar(fulfilled);

    const current = getCarTrackingData(carKey);
    setCarTrackingData(carKey, {
      ...current,
      blueprints: {
        ...(current.blueprints ?? {}),
        ownedByStar: fulfilled,
      },
    });
  }, [done, rows, carKey]);

  const updateOwnedForStar = (star: number, value: number) => {
    const safeValue = Number.isFinite(value) ? Math.max(0, Math.floor(value)) : 0;

    setOwnedByStar((prev) => {
      const next = { ...prev, [star]: safeValue };

      const current = getCarTrackingData(carKey);
      setCarTrackingData(carKey, {
        ...current,
        blueprints: {
          ...(current.blueprints ?? {}),
          ownedByStar: next,
        },
      });

      return next;
    });
  };

  const totalOwned = Object.values(ownedByStar).reduce(
    (a, b) => a + (Number(b) || 0),
    0
  );

  const starsLeft = Math.max(0, maxStars - currentStars);

  /**
   * ✅ THIS is what makes Firebase start showing blueprint data:
   * autosync triggers when blueprint content changes.
   */
  const bpDepsKey = useMemo(() => {
    const entries = Object.entries(ownedByStar)
      .map(([k, v]) => [Number(k), Number(v) || 0] as const)
      .sort((a, b) => a[0] - b[0]);

    return `${carKey}|bp:${entries.map(([k, v]) => `${k}:${v}`).join(',')}`;
  }, [carKey, ownedByStar]);

  useAutoSyncDependency([bpDepsKey]);

  return {
    maxStars,
    currentStars,
    goldMaxed,
    done,
    targetStar,
    ownedByStar,
    updateOwnedForStar,
    totalOwned,
    starsLeft,
  };
}