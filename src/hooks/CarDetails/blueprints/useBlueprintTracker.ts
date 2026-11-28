import { useEffect, useMemo, useState } from 'react';
import { generateCarKey } from '@/utils/shared/StorageUtils';
import type { BlueprintsRow } from '@/types/CarDetails/blueprints';
import { useAutoSyncDependency } from '@/hooks/UserDataSync/useAutoSync';
import {
  fillCompletedStars,
  reachedStarRank,
  readBlueprintState,
  saveFilledOwnedByStar,
  saveOwnedByStarEdit,
  saveReachedStarRank,
  type BlueprintState,
} from '@/utils/CarDetails/blueprints/blueprintProgressStorage';
import { notifyCarTrackingChanged, onCarTrackingChanged } from '@/utils/CarDetails/miscellaneous/carTrackingEvents';

export function useBlueprintTracker(params: {
  brand: string;
  model: string;
  isKeyCar: boolean;
  rows: BlueprintsRow[];
}) {
  const { brand, model, isKeyCar, rows } = params;

  const maxStars = rows[rows.length - 1]?.star ?? 0;
  const carKey = useMemo(() => generateCarKey(brand, model), [brand, model]);

  // Read during render (like the original snapshot), before other tables' effects save anything
  const [state, setState] = useState<BlueprintState>(() => readBlueprintState(carKey));
  const isCurrent = state.carKey === carKey;
  if (!isCurrent) setState(readBlueprintState(carKey));
  const { ownedByStar, stars: currentStars, goldMaxed } = state;

  // Re-read after a download from the account or a change from the Class table
  useEffect(() => {
    const reload = () => setState(readBlueprintState(carKey));
    window.addEventListener('user-progress-synced', reload);
    const stopListening = onCarTrackingChanged(carKey, 'blueprints', reload);
    return () => {
      window.removeEventListener('user-progress-synced', reload);
      stopListening();
    };
  }, [carKey]);

  const done = goldMaxed || currentStars >= maxStars;

  // Done => no input; 0 stars => 1★; otherwise the next star
  const targetStar = done ? -1 : currentStars === 0 ? 1 : Math.min(currentStars + 1, maxStars);

  // Fill stars already reached (all when done) without a new edit time
  const completeUpTo = done ? maxStars : currentStars;
  useEffect(() => {
    if (!isCurrent || completeUpTo <= 0) return;
    const next = fillCompletedStars(ownedByStar, rows, completeUpTo);
    if (!next) return;
    saveFilledOwnedByStar(carKey, next);
    setState((prev) => ({ ...prev, ownedByStar: next }));
  }, [isCurrent, completeUpTo, rows, carKey, ownedByStar]);

  // Capped at the requirement; reaching it completes the star, lowering a completed star un-completes it
  const updateOwnedForStar = (star: number, value: number) => {
    if (!isCurrent) return;
    const required = rows.find((r) => r.star === star)?.value;
    const floored = Number.isFinite(value) ? Math.max(0, Math.floor(value)) : 0;
    const safeValue = typeof required === 'number' ? Math.min(floored, required) : floored;
    const wasComplete = done || star <= currentStars;
    const uncomplete = wasComplete && typeof required === 'number' && safeValue < required;
    const next = { ...ownedByStar, [star]: safeValue };
    const lowered = uncomplete ? Math.min(currentStars, star - 1) : currentStars;
    const reached = uncomplete ? lowered : reachedStarRank(next, rows, currentStars);

    saveOwnedByStarEdit(carKey, next, isKeyCar, uncomplete ? lowered : undefined);
    if (reached > currentStars) saveReachedStarRank(carKey, reached, isKeyCar);
    setState({
      carKey,
      ownedByStar: next,
      stars: reached,
      goldMaxed: uncomplete ? false : goldMaxed,
    });
    if (reached !== currentStars) notifyCarTrackingChanged(carKey, 'blueprints');
  };

  const totalOwned = Object.values(ownedByStar).reduce((a, b) => a + (Number(b) || 0), 0);

  const starsLeft = Math.max(0, maxStars - currentStars);

  // Autosync triggers when blueprint content changes
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