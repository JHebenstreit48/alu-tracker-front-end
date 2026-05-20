import { STAR_KEYS, emptyBlock } from '@/types/CarDataSubmission/tabs/shared';
import {
  initDeltasState,
  emptyImportDeltaRow,
  type ImportDeltaRowState,
} from '@/types/CarDataSubmission/tabs/deltas';
import type {
  BpsMap, StatBlockMap, StatBlockArrMap, StageInputMap,
  StringKeyMap, NestedStringMap, DeepStringMap,
  DeltasMap, ImportDeltasMap, CorrectionMap,
} from '@/hooks/CarDataSubmission/useCarSeedFields/types';

function seedEntryToImportDeltaRow(entry: any): ImportDeltaRowState {
  const cards = entry.cardsAppliedByStat ?? {};
  const delta = entry.statDeltaByStat ?? {};
  return {
    stage:         entry.stage ?? 1,
    rarity:        entry.rarity ?? 'uncommon',
    cardsTopSpeed: cards.topSpeed     !== undefined ? String(cards.topSpeed)     : '',
    cardsAccel:    cards.acceleration !== undefined ? String(cards.acceleration) : '',
    cardsHandling: cards.handling     !== undefined ? String(cards.handling)     : '',
    cardsNitro:    cards.nitro        !== undefined ? String(cards.nitro)        : '',
    deltaTopSpeed: delta.topSpeed     !== undefined ? String(delta.topSpeed)     : '',
    deltaAccel:    delta.acceleration !== undefined ? String(delta.acceleration) : '',
    deltaHandling: delta.handling     !== undefined ? String(delta.handling)     : '',
    deltaNitro:    delta.nitro        !== undefined ? String(delta.nitro)        : '',
  };
}

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
  seedImportDeltasByStar: Record<string, any[]> | null,
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

  const getImportDeltas = (k: string) => {
    if (importDeltasMap[k]) return importDeltasMap[k];

    return STAR_KEYS.map((starKey, i) => {
      const seedEntries: any[] = seedImportDeltasByStar?.[starKey] ?? [];
      if (seedEntries.length) {
        return seedEntries.map((entry: any) => seedEntryToImportDeltaRow(entry));
      }
      return [
        emptyImportDeltaRow(
          importStageNums[i] ? Number(importStageNums[i]) : i + 1,
          'uncommon'
        ),
      ];
    });
  };

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