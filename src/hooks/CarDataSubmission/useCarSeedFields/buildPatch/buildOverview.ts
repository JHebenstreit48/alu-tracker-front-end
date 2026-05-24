import type { Car } from '@/types/shared/car';
import type { CarStatsPatch, StarStatBlock } from '@/types/CarDataSubmission/carSubmission';
import { STAR_KEYS, toNum, type StatBlockState } from '@/types/CarDataSubmission/tabs/shared';
import type { ReturnedGetters } from '@/hooks/CarDataSubmission/useCarSeedFields/anyValue';

export function buildOverview(
  car: Car,
  stats: CarStatsPatch,
  getters: ReturnedGetters,
  blockToStar: (b: StatBlockState) => StarStatBlock | undefined,
): void {
  const k = car.normalizedKey ?? String(car.id);
  const { getBps, getStock, getGold } = getters;

  const bp: Record<string, unknown> = {};
  getBps(k).forEach((v, i) => {
    const n = toNum(v); if (n !== undefined) bp[STAR_KEYS[i]] = n;
  });
  if (Object.keys(bp).length) stats.blueprints = bp;

  const ss = blockToStar(getStock(k)); if (ss) stats.stock = ss;
  const gs = blockToStar(getGold(k));  if (gs) stats.gold  = gs;
}