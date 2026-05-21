import { STAR_KEYS, emptyBlock } from '@/types/CarDataSubmission/tabs/shared';
import {
  initDeltasState,
  emptyDeltaRow,
  emptyImportDeltaRow,
  type DeltaRowState,
  type ImportDeltaRowState,
} from '@/types/CarDataSubmission/tabs/deltas';
import type {
  BpsMap, StatBlockMap, StatBlockArrMap, StageInputMap,
  StringKeyMap, NestedStringMap, DeepStringMap,
  DeltasMap, ImportDeltasMap, CorrectionMap,
} from '@/hooks/CarDataSubmission/useCarSeedFields/types';

// Stage deltas: always rankByStat / statByStat. Zero = not entered = empty string.
function seedEntryToStageDeltaRow(entry: any): DeltaRowState {
  const rank = entry.rankByStat ?? {};
  const stat = entry.statByStat ?? {};
  const val = (v: any) => (v !== undefined && v !== 0) ? String(v) : '';
  return {
    stage:         entry.stage ?? 1,
    cardsTopSpeed: val(rank.topSpeed),
    cardsAccel:    val(rank.acceleration),
    cardsHandling: val(rank.handling),
    cardsNitro:    val(rank.nitro),
    deltaTopSpeed: val(stat.topSpeed),
    deltaAccel:    val(stat.acceleration),
    deltaHandling: val(stat.handling),
    deltaNitro:    val(stat.nitro),
  };
}

// Import deltas: always cardsAppliedByStat / statDeltaByStat. Zero = not entered = empty string.
function seedEntryToImportDeltaRow(entry: any): ImportDeltaRowState {
  const cards = entry.cardsAppliedByStat ?? {};
  const delta = entry.statDeltaByStat ?? {};
  const val = (v: any) => (v !== undefined && v !== 0) ? String(v) : '';
  return {
    stage:         entry.stage ?? 1,
    rarity:        entry.rarity ?? 'uncommon',
    cardsTopSpeed: val(cards.topSpeed),
    cardsAccel:    val(cards.acceleration),
    cardsHandling: val(cards.handling),
    cardsNitro:    val(cards.nitro),
    deltaTopSpeed: val(delta.topSpeed),
    deltaAccel:    val(delta.acceleration),
    deltaHandling: val(delta.handling),
    deltaNitro:    val(delta.nitro),
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
  seedStageDeltasByStar:  Record<string, any[]> | null,
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

  const getStageDeltas = (k: string) => {
    if (stageDeltasMap[k]) return stageDeltasMap[k];

    let nextStage = 1;

    return STAR_KEYS.map((starKey) => {
      const seedEntries: any[] = seedStageDeltasByStar?.[starKey] ?? [];
      if (seedEntries.length) {
        const rows = seedEntries.map((entry: any) => seedEntryToStageDeltaRow(entry));
        const lastStage = seedEntries[seedEntries.length - 1]?.stage ?? nextStage;
        nextStage = lastStage + 1;
        return rows;
      }
      // No seed data — generate empty rows starting from nextStage
      const rows = Array(stagesDeltaRowCount).fill(null).map((_, i) =>
        emptyDeltaRow(nextStage + i)
      );
      nextStage = nextStage + stagesDeltaRowCount;
      return rows;
    });
  };

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