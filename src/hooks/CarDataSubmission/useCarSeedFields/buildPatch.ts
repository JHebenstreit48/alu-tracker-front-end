import type { Car } from '@/types/shared/car';
import type { CarStatsPatch, StarStatBlock } from '@/types/CarDataSubmission/carSubmission';
import { toNum, type StatBlockState } from '@/types/CarDataSubmission/tabs/shared';
import type { ReturnedGetters } from '@/hooks/CarDataSubmission/useCarSeedFields/anyValue';
import { buildOverview } from '@/hooks/CarDataSubmission/useCarSeedFields/buildPatch/buildOverview';
import { buildMaxStars } from '@/hooks/CarDataSubmission/useCarSeedFields/buildPatch/buildMaxStars';
import { buildStages } from '@/hooks/CarDataSubmission/useCarSeedFields/buildPatch/buildStages';
import { buildCreditCosts } from '@/hooks/CarDataSubmission/useCarSeedFields/buildPatch/buildCreditCosts';
import { buildGarageLevelXp } from '@/hooks/CarDataSubmission/useCarSeedFields/buildPatch/buildGarageLevelXp';
import { buildDeltas } from '@/hooks/CarDataSubmission/useCarSeedFields/buildPatch/buildDeltas';

export function buildStatsPatch(car: Car, getters: ReturnedGetters): CarStatsPatch {
  const stats: CarStatsPatch = {};

  const blockToStar = (b: StatBlockState): StarStatBlock | undefined => {
    const out: StarStatBlock = {};
    const r  = toNum(b.rank);     if (r  !== undefined) out.rank         = r;
    const ts = toNum(b.topSpeed); if (ts !== undefined) out.topSpeed     = ts;
    const a  = toNum(b.accel);    if (a  !== undefined) out.acceleration = a;
    const h  = toNum(b.handling); if (h  !== undefined) out.handling     = h;
    const n  = toNum(b.nitro);    if (n  !== undefined) out.nitro        = n;
    return Object.keys(out).length ? out : undefined;
  };

  buildOverview(car, stats, getters, blockToStar);
  buildMaxStars(car, stats, getters, blockToStar);
  buildStages(car, stats, getters);
  buildCreditCosts(car, stats, getters);
  buildGarageLevelXp(car, stats, getters);
  buildDeltas(car, stats, getters);

  return stats;
}