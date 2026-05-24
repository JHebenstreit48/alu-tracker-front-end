import type { Car } from '@/types/shared/car';
import type { CarStatsPatch, StarStatBlock } from '@/types/CarDataSubmission/carSubmission';
import { STAR_KEYS, type StatBlockState } from '@/types/CarDataSubmission/tabs/shared';
import type { ReturnedGetters } from '@/hooks/CarDataSubmission/useCarSeedFields/anyValue';

export function buildMaxStars(
  car: Car,
  stats: CarStatsPatch,
  getters: ReturnedGetters,
  blockToStar: (b: StatBlockState) => StarStatBlock | undefined,
): void {
  const k = car.normalizedKey ?? String(car.id);
  const { getMax } = getters;

  const mx: CarStatsPatch['maxAtStar'] = {};
  getMax(k).forEach((b, i) => {
    const s = blockToStar(b); if (s) mx[STAR_KEYS[i]] = s;
  });
  if (Object.keys(mx).length) stats.maxAtStar = mx;
}