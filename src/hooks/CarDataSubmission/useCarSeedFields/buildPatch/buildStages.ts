import type { Car } from '@/types/shared/car';
import type { CarStatsPatch } from '@/types/CarDataSubmission/carSubmission';
import { STAR_KEYS, toNum } from '@/types/CarDataSubmission/tabs/shared';
import type { ReturnedGetters } from '@/hooks/CarDataSubmission/useCarSeedFields/anyValue';

export function buildStages(
  car: Car,
  stats: CarStatsPatch,
  getters: ReturnedGetters,
): void {
  const k     = car.normalizedKey ?? String(car.id);
  const stars = car.stars ?? 6;
  const { getStageInputs, getSeedStagesByStar } = getters;

  const si = getStageInputs(k);
  if (!Object.keys(si).length) return;

  const seedStagesByStar = getSeedStagesByStar();
  const stagesOut: Record<string, any[]> = {};

  STAR_KEYS.slice(0, stars).forEach((starKey) => {
    const seedEntries: any[] = seedStagesByStar?.[starKey] ?? [];
    const starEntries: any[] = [];

    seedEntries.forEach((seedEntry: any) => {
      const stageNum = String(seedEntry.stage);
      const input = si[stageNum];
      if (!input) return;
      const out: Record<string, unknown> = { stage: seedEntry.stage };
      const r  = toNum(input.rank);     if (r  !== undefined) out.rank         = r;
      const ts = toNum(input.topSpeed); if (ts !== undefined) out.topSpeed     = ts;
      const a  = toNum(input.accel);    if (a  !== undefined) out.acceleration = a;
      const h  = toNum(input.handling); if (h  !== undefined) out.handling     = h;
      const n  = toNum(input.nitro);    if (n  !== undefined) out.nitro        = n;
      if (Object.keys(out).length > 1) starEntries.push(out);
    });

    if (starEntries.length) stagesOut[starKey] = starEntries;
  });

  if (Object.keys(stagesOut).length) stats.stages = stagesOut;
}