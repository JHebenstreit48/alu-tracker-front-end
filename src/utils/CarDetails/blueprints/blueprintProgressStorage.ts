import { getCarTrackingData, setCarTrackingData } from '@/utils/shared/StorageUtils';
import type { BlueprintsRow } from '@/types/CarDetails/blueprints';

export interface BlueprintState {
  carKey: string;
  ownedByStar: Record<number, number>;
  stars: number;
  goldMaxed: boolean;
}

export function readBlueprintState(carKey: string): BlueprintState {
  const data = getCarTrackingData(carKey);
  return {
    carKey,
    ownedByStar: { ...(data.blueprints?.ownedByStar ?? {}) },
    stars: typeof data.stars === 'number' ? data.stars : 0,
    goldMaxed: !!data.goldMaxed,
  };
}

// App-filled values keep the old edit time so they never outrank a real edit
export function saveFilledOwnedByStar(carKey: string, ownedByStar: Record<number, number>): void {
  const current = getCarTrackingData(carKey);
  setCarTrackingData(carKey, {
    blueprints: { ...(current.blueprints ?? {}), ownedByStar },
  });
}

// User edits get a new edit time; uncompleteTo lowers the star rank and clears gold maxed
export function saveOwnedByStarEdit(
  carKey: string,
  ownedByStar: Record<number, number>,
  isKeyCar: boolean,
  uncompleteTo?: number
): void {
  const current = getCarTrackingData(carKey);
  const uncomplete =
    uncompleteTo === undefined
      ? {}
      : {
          stars: uncompleteTo > 0 ? uncompleteTo : undefined,
          goldMaxed: false,
          // Non-key cars at 0★ are not unlocked; key cars keep owned (set by the key)
          ...(!isKeyCar && uncompleteTo === 0 ? { owned: false } : {}),
        };
  setCarTrackingData(carKey, {
    blueprints: { ...(current.blueprints ?? {}), ownedByStar, updatedAt: Date.now() },
    ...uncomplete,
  });
}

// Saves a star rank reached through blueprints; non-key cars become owned
export function saveReachedStarRank(carKey: string, stars: number, isKeyCar: boolean): void {
  setCarTrackingData(carKey, { stars, ...(!isKeyCar ? { owned: true } : {}) });
}

// Highest star rank the blueprint counts reach, counting up from fromStars
export function reachedStarRank(
  ownedByStar: Record<number, number>,
  rows: BlueprintsRow[],
  fromStars: number
): number {
  let reached = fromStars;
  for (const r of rows) {
    if (r.star <= reached) continue;
    if (r.star !== reached + 1 || typeof r.value !== 'number') break;
    if ((ownedByStar[r.star] ?? 0) < r.value) break;
    reached = r.star;
  }
  return reached;
}

// Sets every star up to upToStar to its requirement; returns null when nothing changes
export function fillCompletedStars(
  ownedByStar: Record<number, number>,
  rows: BlueprintsRow[],
  upToStar: number
): Record<number, number> | null {
  const next = { ...ownedByStar };
  let changed = false;

  rows.forEach((r) => {
    if (r.star <= upToStar && typeof r.value === 'number' && next[r.star] !== r.value) {
      next[r.star] = r.value;
      changed = true;
    }
  });

  return changed ? next : null;
}