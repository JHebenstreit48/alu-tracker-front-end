import type { Car } from '@/types/shared/car';
import type { CarStatsPatch } from '@/types/CarDataSubmission/carSubmission';
import type { DeltasByStar } from '@/types/CarDataSubmission/carDeltas';
import { STAR_KEYS, toNum } from '@/types/CarDataSubmission/tabs/shared';
import { anyInDeltaRow } from '@/types/CarDataSubmission/tabs/deltas';
import type { ReturnedGetters } from '@/hooks/CarDataSubmission/useCarSeedFields/anyValue';

export function buildDeltas(
  car: Car,
  stats: CarStatsPatch,
  getters: ReturnedGetters,
): void {
  const k     = car.normalizedKey ?? String(car.id);
  const stars = car.stars ?? 6;
  const {
    getStageDeltas,
    getImportDeltas,
    hasUserStageDeltaEdits,
    hasUserImportDeltaEdits,
  } = getters;

  // Stage deltas — only submit if user actually edited them
  if (hasUserStageDeltaEdits(k)) {
    const sdOut: DeltasByStar = {};
    getStageDeltas(k).slice(0, stars).forEach((rows, i) => {
      const entries = rows
        .filter((row) =>
          [
            toNum(row.cardsTopSpeed), toNum(row.cardsAccel),
            toNum(row.cardsHandling), toNum(row.cardsNitro),
            toNum(row.deltaTopSpeed), toNum(row.deltaAccel),
            toNum(row.deltaHandling), toNum(row.deltaNitro),
          ].some((v) => v !== undefined && v !== 0)
        )
        .map((row) => {
          const entry: any = { stage: row.stage };
          const rank = {
            topSpeed:     toNum(row.cardsTopSpeed),
            acceleration: toNum(row.cardsAccel),
            handling:     toNum(row.cardsHandling),
            nitro:        toNum(row.cardsNitro),
          };
          const stat = {
            topSpeed:     toNum(row.deltaTopSpeed),
            acceleration: toNum(row.deltaAccel),
            handling:     toNum(row.deltaHandling),
            nitro:        toNum(row.deltaNitro),
          };
          if (Object.values(rank).some((v) => v !== undefined)) entry.rankByStat = rank;
          if (Object.values(stat).some((v) => v !== undefined)) entry.statByStat = stat;
          return entry;
        });
      if (entries.length) (sdOut as any)[STAR_KEYS[i]] = entries;
    });
    if (Object.keys(sdOut).length) stats.stageDeltas = sdOut;
  }

  // Import deltas — only submit if user actually edited them
  if (hasUserImportDeltaEdits(k)) {
    const idOut: DeltasByStar = {};
    getImportDeltas(k).slice(0, stars).forEach((rows, i) => {
      const entries = rows.filter(anyInDeltaRow).map((row) => {
        const entry: any = { stage: row.stage };
        if ('rarity' in row && row.rarity) entry.rarity = row.rarity;
        const cards = {
          topSpeed:     toNum(row.cardsTopSpeed),
          acceleration: toNum(row.cardsAccel),
          handling:     toNum(row.cardsHandling),
          nitro:        toNum(row.cardsNitro),
        };
        const delta = {
          topSpeed:     toNum(row.deltaTopSpeed),
          acceleration: toNum(row.deltaAccel),
          handling:     toNum(row.deltaHandling),
          nitro:        toNum(row.deltaNitro),
        };
        if (Object.values(cards).some((v) => v !== undefined)) entry.cardsAppliedByStat = cards;
        if (Object.values(delta).some((v) => v !== undefined)) entry.statDeltaByStat = delta;
        return entry;
      });
      if (entries.length) (idOut as any)[STAR_KEYS[i]] = entries;
    });
    if (Object.keys(idOut).length) stats.importDeltas = idOut;
  }
}