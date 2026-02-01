import { useEffect, useMemo, useState } from 'react';
import {
  generateCarKey,
  getCarTrackingData,
  setCarTrackingData,
} from '@/utils/shared/StorageUtils';
import type { BlueprintsRow } from '@/types/CarDetails/Blueprints';

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
   * Editable star rule:
   * - Editable = currentStars
   * - If currentStars === 0 → editable = 1
   * - If done → no editable row
   */
  const targetStar = done
    ? -1
    : Math.min(Math.max(currentStars === 0 ? 1 : currentStars, 1), maxStars);

  /**
   * ✅ NEW: Auto-fulfill blueprint ownership for completed cars
   * Only runs if:
   * - Car is done
   * - User has NOT manually tracked blueprints yet
   */
  useEffect(() => {
    if (!done) return;
    if (Object.keys(ownedByStar).length > 0) return;

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
  }, [done, rows, carKey, ownedByStar]);

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