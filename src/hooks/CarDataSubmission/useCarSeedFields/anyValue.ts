import type { Car } from '@/types/shared/car';
import { anyInBlock } from '@/types/CarDataSubmission/tabs/shared';
import { anyInDeltaRow } from '@/types/CarDataSubmission/tabs/deltas';
import { anyInStageInput } from '@/types/CarDataSubmission/tabs/stages';

export type ReturnedGetters = {
  getBps:                   (k: string) => string[];
  getStock:                 (k: string) => any;
  getGold:                  (k: string) => any;
  getMax:                   (k: string) => any[];
  getStageInputs:           (k: string) => Record<string, any>;
  getCosts:                 (k: string) => Record<string, string>;
  getXp:                    (k: string) => Record<string, string>;
  getImportCosts:           (k: string) => Record<string, Record<string, string>>;
  getImportXp:              (k: string) => Record<string, Record<string, string>>;
  getImportReqs:            (k: string) => Record<string, Record<string, Record<string, string>>>;
  getStageDeltas:           (k: string) => any[][];
  getImportDeltas:          (k: string) => any[][];
  hasUserStageDeltaEdits:   (k: string) => boolean;
  hasUserImportDeltaEdits:  (k: string) => boolean;
};

export function computeAnyValue(
  selectedCars: Car[],
  getters: ReturnedGetters,
): boolean {
  const {
    getBps, getStock, getGold, getMax, getStageInputs,
    getCosts, getXp, getImportCosts, getImportXp, getImportReqs,
    getStageDeltas, getImportDeltas,
    hasUserStageDeltaEdits, hasUserImportDeltaEdits,
  } = getters;

  return selectedCars.some((c) => {
    const k = c.normalizedKey ?? String(c.id);
    return (
      getBps(k).some((x) => x.trim() !== '') ||
      anyInBlock(getStock(k)) ||
      anyInBlock(getGold(k)) ||
      getMax(k).some(anyInBlock) ||
      Object.values(getStageInputs(k)).some(anyInStageInput) ||
      Object.values(getCosts(k)).some((v) => v.trim() !== '') ||
      Object.values(getXp(k)).some((v) => v.trim() !== '') ||
      Object.values(getImportCosts(k)).some((s) =>
        Object.values(s).some((v) => (v as string).trim() !== '')) ||
      Object.values(getImportXp(k)).some((s) =>
        Object.values(s).some((v) => (v as string).trim() !== '')) ||
      Object.values(getImportReqs(k)).some((s) =>
        Object.values(s).some((r) =>
          Object.values(r as any).some((v) => (v as string).trim() !== ''))) ||
      (hasUserStageDeltaEdits(k) && getStageDeltas(k).some((rows) => rows.some(anyInDeltaRow))) ||
      (hasUserImportDeltaEdits(k) && getImportDeltas(k).some((rows) => rows.some(anyInDeltaRow)))
    );
  });
}