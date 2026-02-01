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
  const { brand, model, isKeyCar, rows } = params;

  const maxStars = rows[rows.length - 1]?.star ?? 0;

  const carKey = useMemo(() => generateCarKey(brand, model), [brand, model]);

  // NOTE: snapshot is only used for initial boot values
  const snapshot = useMemo(() => getCarTrackingData(carKey), [carKey]);

  const currentStars = typeof snapshot.stars === 'number' ? snapshot.stars : 0;
  const goldMaxed = !!snapshot.goldMaxed;

  const [ownedByStar, setOwnedByStar] = useState<Record<number, number>>(
    (snapshot.blueprints?.ownedByStar ?? {}) as Record<number, number>
  );

  // Keep ownedByStar synced if user navigates / key changes
  useEffect(() => {
    const fresh = getCarTrackingData(carKey);
    setOwnedByStar((fresh.blueprints?.ownedByStar ?? {}) as Record<number, number>);
  }, [carKey]);

  const done = goldMaxed || currentStars >= maxStars;

  /**
   * NEW RULE:
   * - Editable row = currentStars
   * - If currentStars === 0, editable row should be 1 (so users can start unlocking)
   * - If done, hide input
   *
   * We keep the name `targetStar` so you don't have to refactor other files yet.
   */
  const targetStar = done
    ? -1
    : Math.min(Math.max(currentStars === 0 ? 1 : currentStars, 1), maxStars);

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

  const totalOwned = Object.values(ownedByStar).reduce((a, b) => a + (Number(b) || 0), 0);

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