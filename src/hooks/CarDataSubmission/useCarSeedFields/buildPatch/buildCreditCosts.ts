import type { Car } from '@/types/shared/car';
import type { CarStatsPatch } from '@/types/CarDataSubmission/carSubmission';
import { toNum } from '@/types/CarDataSubmission/tabs/shared';
import type { ReturnedGetters } from '@/hooks/CarDataSubmission/useCarSeedFields/anyValue';

export function buildCreditCosts(
  car: Car,
  stats: CarStatsPatch,
  getters: ReturnedGetters,
): void {
  const k = car.normalizedKey ?? String(car.id);
  const { getCosts } = getters;

  const co: Record<string, unknown> = {};
  Object.entries(getCosts(k)).forEach(([stageNum, v]) => {
    const n = toNum(v); if (n !== undefined) co[stageNum] = n;
  });
  if (Object.keys(co).length) stats.creditCosts = co;
}