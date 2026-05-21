import { useMemo } from 'react';
import type { Car, FullCar } from '@/types/shared/car';
import { STAR_KEYS, stageKeys } from '@/types/CarDataSubmission/tabs/shared';
import { useCarSeedData } from '@/hooks/CarDataSubmission/useCarSeedData';
import { useCarSeedFieldsState } from '@/hooks/CarDataSubmission/useCarSeedFields/state';
import { makeSeedSelectors } from '@/hooks/CarDataSubmission/useCarSeedFields/seedSelectors';
import { makeGetters } from '@/hooks/CarDataSubmission/useCarSeedFields/getters';
import { makeUpdaters } from '@/hooks/CarDataSubmission/useCarSeedFields/updaters';
import { computeAnyValue } from '@/hooks/CarDataSubmission/useCarSeedFields/anyValue';
import { buildStatsPatch as _buildStatsPatch } from '@/hooks/CarDataSubmission/useCarSeedFields/buildPatch';

export function useCarSeedFields(selectedCars: Car[], activeCarIdx: number) {
  const safeIdx     = Math.min(activeCarIdx, Math.max(0, selectedCars.length - 1));
  const activeCar   = selectedCars[safeIdx] ?? null;
  const activeKey   = activeCar?.normalizedKey ?? String(activeCar?.id ?? '');
  const activeStars = activeCar?.stars ?? 6;

  const { data: seedData, loading: seedLoading } = useCarSeedData(
    activeCar?.normalizedKey ?? null
  );

  const sd = seedData as FullCar | null;

  const stageCount = useMemo(() => {
    const fromCredit = stageKeys((sd as any)?.creditCosts?.perUpgradeByStage).length;
    const fromXp     = stageKeys((sd as any)?.garageLevelXp?.perUpgradeByStage).length;
    return fromCredit || fromXp || Math.max(activeStars + 7, 10);
  }, [sd, activeStars]);

  const seedStageNums = useMemo(() =>
    stageKeys((sd as any)?.creditCosts?.perUpgradeByStage) ||
    stageKeys((sd as any)?.garageLevelXp?.perUpgradeByStage),
    [sd]
  );

  const importStageNums = useMemo(() =>
    stageKeys((sd as any)?.imports?.requirements?.incrementalByStage),
    [sd]
  );

  const stagesDeltaRowCount = useMemo(() => {
    const deltas = (sd as any)?.stageDeltas;
    if (!deltas) return 3;
    return Math.max(...STAR_KEYS.map((k) => Array.isArray(deltas[k]) ? deltas[k].length : 0), 3);
  }, [sd]);

  const seeds = useMemo(() =>
    makeSeedSelectors(sd),
    [sd]
  );

  const state = useCarSeedFieldsState();

  const getters = makeGetters(
    state.bpsMap, state.stockMap, state.goldMap, state.maxMap,
    state.stageInputMap, state.costMap, state.xpMap,
    state.importCostMap, state.importXpMap, state.importReqMap,
    state.stageDeltasMap, state.importDeltasMap, state.correctionMode,
    stagesDeltaRowCount, importStageNums,
    seeds.seedImportDeltasByStar,
    seeds.seedStageDeltasByStar,
  );

  const updaters = makeUpdaters(
    activeKey, stagesDeltaRowCount, importStageNums,
    state.setBpsMap, state.setStockMap, state.setGoldMap, state.setMaxMap,
    state.setStageInputMap, state.setCostMap, state.setXpMap,
    state.setImportCostMap, state.setImportXpMap, state.setImportReqMap,
    state.setStageDeltasMap, state.setImportDeltasMap, state.setCorrectionMode,
    seeds.seedStageDeltasByStar,  // ← added
  );

  const anyValue = useMemo(() =>
    computeAnyValue(selectedCars, getters),
    [selectedCars, state.bpsMap, state.stockMap, state.goldMap, state.maxMap,
      state.stageInputMap, state.costMap, state.xpMap,
      state.importCostMap, state.importXpMap, state.importReqMap,
      state.stageDeltasMap, state.importDeltasMap]
  );

  const buildStatsPatch = (car: Car) => _buildStatsPatch(car, getters);

  return {
    activeCar,
    activeKey,
    activeStars,
    seedLoading,
    seedData: sd,
    stageCount,
    seedStageNums,
    importStageNums,
    stagesDeltaRowCount,
    ...seeds,
    ...getters,
    ...updaters,
    anyValue,
    buildStatsPatch,
  };
}

export type CarSeedFields = ReturnType<typeof useCarSeedFields>;