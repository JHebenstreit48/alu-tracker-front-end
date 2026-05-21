import { STAR_KEYS, emptyBlock } from '@/types/CarDataSubmission/tabs/shared';
import type { StatBlockState } from '@/types/CarDataSubmission/tabs/shared';
import {
  emptyDeltaRow,
  emptyImportDeltaRow,
  type DeltaRowState,
  type ImportDeltaRowState,
} from '@/types/CarDataSubmission/tabs/deltas';
import { emptyStageInput, type StageStatInputState } from '@/types/CarDataSubmission/tabs/stages';
import type {
  BpsMap, StatBlockMap, StatBlockArrMap, StageInputMap,
  StringKeyMap, NestedStringMap, DeepStringMap,
  DeltasMap, ImportDeltasMap, CorrectionMap,
} from '@/hooks/CarDataSubmission/useCarSeedFields/types';

type Setter<T> = (fn: (prev: T) => T) => void;

export function makeUpdaters(
  activeKey: string,
  stagesDeltaRowCount: number,
  importStageNums: string[],
  setBpsMap:          Setter<BpsMap>,
  setStockMap:        Setter<StatBlockMap>,
  setGoldMap:         Setter<StatBlockMap>,
  setMaxMap:          Setter<StatBlockArrMap>,
  setStageInputMap:   Setter<StageInputMap>,
  setCostMap:         Setter<StringKeyMap>,
  setXpMap:           Setter<StringKeyMap>,
  setImportCostMap:   Setter<NestedStringMap>,
  setImportXpMap:     Setter<NestedStringMap>,
  setImportReqMap:    Setter<DeepStringMap>,
  setStageDeltasMap:  Setter<DeltasMap>,
  setImportDeltasMap: Setter<ImportDeltasMap>,
  setCorrectionMode:  Setter<CorrectionMap>,
  seedStageDeltasByStar: Record<string, any[]> | null,
) {
  function buildInitialStageDeltasState(): DeltaRowState[][] {
    let nextStage = 1;
    return STAR_KEYS.map((starKey) => {
      const seedEntries: any[] = seedStageDeltasByStar?.[starKey] ?? [];
      if (seedEntries.length) {
        const lastStage = seedEntries[seedEntries.length - 1]?.stage ?? nextStage;
        nextStage = lastStage + 1;
        return seedEntries.map((entry: any) => emptyDeltaRow(entry.stage));
      }
      const rows = Array(stagesDeltaRowCount).fill(null).map((_, i) =>
        emptyDeltaRow(nextStage + i)
      );
      nextStage = nextStage + stagesDeltaRowCount;
      return rows;
    });
  }

  const updateBp = (i: number, v: string) =>
    setBpsMap((p) => {
      const a = [...(p[activeKey] ?? Array(6).fill(''))]; a[i] = v;
      return { ...p, [activeKey]: a };
    });

  const updateStock = (field: keyof StatBlockState, v: string) =>
    setStockMap((p) => ({
      ...p, [activeKey]: { ...(p[activeKey] ?? emptyBlock()), [field]: v },
    }));

  const updateGold = (field: keyof StatBlockState, v: string) =>
    setGoldMap((p) => ({
      ...p, [activeKey]: { ...(p[activeKey] ?? emptyBlock()), [field]: v },
    }));

  const updateMax = (i: number, field: keyof StatBlockState, v: string) =>
    setMaxMap((p) => {
      const a = [...(p[activeKey] ?? STAR_KEYS.map(() => emptyBlock()))];
      a[i] = { ...a[i], [field]: v };
      return { ...p, [activeKey]: a };
    });

  const updateStageInput = (stageNum: string, field: keyof StageStatInputState, v: string) =>
    setStageInputMap((p) => {
      const cur = p[activeKey] ?? {};
      const entry = cur[stageNum] ?? emptyStageInput(Number(stageNum));
      return { ...p, [activeKey]: { ...cur, [stageNum]: { ...entry, [field]: v } } };
    });

  const updateCost = (stageNum: string, v: string) =>
    setCostMap((p) => ({
      ...p, [activeKey]: { ...(p[activeKey] ?? {}), [stageNum]: v },
    }));

  const updateXp = (stageNum: string, v: string) =>
    setXpMap((p) => ({
      ...p, [activeKey]: { ...(p[activeKey] ?? {}), [stageNum]: v },
    }));

  const updateImportCost = (stageNum: string, rarity: string, v: string) =>
    setImportCostMap((p) => {
      const cur = p[activeKey] ?? {};
      const stage = cur[stageNum] ?? {};
      return { ...p, [activeKey]: { ...cur, [stageNum]: { ...stage, [rarity]: v } } };
    });

  const updateImportXp = (stageNum: string, rarity: string, v: string) =>
    setImportXpMap((p) => {
      const cur = p[activeKey] ?? {};
      const stage = cur[stageNum] ?? {};
      return { ...p, [activeKey]: { ...cur, [stageNum]: { ...stage, [rarity]: v } } };
    });

  const updateImportReq = (stageNum: string, rarity: string, stat: string, v: string) =>
    setImportReqMap((p) => {
      const cur = p[activeKey] ?? {};
      const stage = cur[stageNum] ?? {};
      const rar = (stage as any)[rarity] ?? {};
      return { ...p, [activeKey]: { ...cur, [stageNum]: { ...stage, [rarity]: { ...rar, [stat]: v } } } };
    });

  const updateStageDelta = (
    starIdx: number, rowIdx: number, field: keyof DeltaRowState, v: string
  ) =>
    setStageDeltasMap((p) => {
      const state = (p[activeKey] ?? buildInitialStageDeltasState()).map((r) => [...r]);
      state[starIdx][rowIdx] = { ...state[starIdx][rowIdx], [field]: v };
      return { ...p, [activeKey]: state };
    });

  const updateImportDelta = (
    starIdx: number, rowIdx: number, field: keyof ImportDeltaRowState, v: string
  ) =>
    setImportDeltasMap((p) => {
      const def = STAR_KEYS.map((_, i) => [
        emptyImportDeltaRow(importStageNums[i] ? Number(importStageNums[i]) : i + 1, 'uncommon'),
      ]);
      const state = (p[activeKey] ?? def).map((r) => [...r]);
      state[starIdx][rowIdx] = { ...state[starIdx][rowIdx], [field]: v };
      return { ...p, [activeKey]: state };
    });

  const toggleCorrectionMode = (tab: string) =>
    setCorrectionMode((p) => ({
      ...p,
      [activeKey]: { ...(p[activeKey] ?? {}), [tab]: !(p[activeKey]?.[tab] ?? false) },
    }));

  return {
    updateBp, updateStock, updateGold, updateMax,
    updateStageInput, updateCost, updateXp,
    updateImportCost, updateImportXp, updateImportReq,
    updateStageDelta, updateImportDelta,
    toggleCorrectionMode,
  };
}