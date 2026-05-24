import type { Car } from '@/types/shared/car';
import type { CarStatsPatch } from '@/types/CarDataSubmission/carSubmission';
import { toNum } from '@/types/CarDataSubmission/tabs/shared';
import type { ReturnedGetters } from '@/hooks/CarDataSubmission/useCarSeedFields/anyValue';

export function buildGarageLevelXp(
  car: Car,
  stats: CarStatsPatch,
  getters: ReturnedGetters,
): void {
  const k = car.normalizedKey ?? String(car.id);
  const { getXp } = getters;

  const xp: Record<string, unknown> = {};
  Object.entries(getXp(k)).forEach(([stageNum, v]) => {
    const n = toNum(v); if (n !== undefined) xp[stageNum] = n;
  });
  if (Object.keys(xp).length) stats.garageLevelXp = xp;
}