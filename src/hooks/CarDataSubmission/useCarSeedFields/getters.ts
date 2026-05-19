import { STAR_KEYS, emptyBlock } from '@/types/CarDataSubmission/tabs/shared';
import {
  initDeltasState,
  emptyImportDeltaRow,
} from '@/types/CarDataSubmission/tabs/deltas';
import type {
  BpsMap, StatBlockMap, StatBlockArrMap, StageInputMap,
  StringKeyMap, NestedStringMap, DeepStringMap,
  DeltasMap, ImportDeltasMap, CorrectionMap,
} from '@/hooks/CarDataSubmission/useCarSeedFields/types';

export function makeGetters(
  bpsMap:          BpsMap,
  stockMap:        StatBlockMap,
  goldMap:         StatBlockMap,
  maxMap:          StatBlockArrMap,
  stageInputMap:   StageInputMap,
  costMap:         StringKeyMap,
  xpMap:           StringKeyMap,
  importCostMap:   NestedStringMap,
  importXpMap:     NestedStringMap,
  importReqMap:    DeepStringMap,
  stageDeltasMap:  DeltasMap,
  importDeltasMap: ImportDeltasMap,
  correctionMode:  CorrectionMap,
  stagesDeltaRowCount: number,
  importStageNums: string[],
) {
  const getBps    = (k: string) => bpsMap[k]   ?? Array(6).fill('');
  const getStock  = (k: string) => stockMap[k]  ?? emptyBlock();
  const getGold   = (k: string) => goldMap[k]   ?? emptyBlock();
  const getMax    = (k: string) => maxMap[k]    ?? STAR_KEYS.map(() => emptyBlock());

  const getStageInputs = (k: string) => stageInputMap[k] ?? {};
  const getCosts       = (k: string) => costMap[k]       ?? {};
  const getXp          = (k: string) => xpMap[k]         ?? {};
  const getImportCosts = (k: string) => importCostMap[k] ?? {};
  const getImportXp    = (k: string) => importXpMap[k]   ?? {};
  const getImportReqs  = (k: string) => importReqMap[k]  ?? {};

  const getStageDeltas = (k: string) =>
    stageDeltasMap[k] ?? initDeltasState(stagesDeltaRowCount);

  const getImportDeltas = (k: string) =>
    importDeltasMap[k] ?? STAR_KEYS.map((_, i) => [
      emptyImportDeltaRow(importStageNums[i] ? Number(importStageNums[i]) : i + 1, 'uncommon'),
      emptyImportDeltaRow(importStageNums[i] ? Number(importStageNums[i]) : i + 1, 'rare'),
    ]);

  const isCorrectionMode = (k: string, tab: string) =>
    correctionMode[k]?.[tab] ?? false;

  return {
    getBps, getStock, getGold, getMax,
    getStageInputs, getCosts, getXp,
    getImportCosts, getImportXp, getImportReqs,
    getStageDeltas, getImportDeltas,
    isCorrectionMode,
  };
}