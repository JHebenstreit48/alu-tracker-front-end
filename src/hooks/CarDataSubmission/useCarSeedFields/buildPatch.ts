import type { Car } from '@/types/shared/car';
import type { CarStatsPatch, StarStatBlock } from '@/types/CarDataSubmission/carSubmission';
import type { DeltasByStar } from '@/types/CarDataSubmission/carDeltas';
import { STAR_KEYS, toNum, type StatBlockState } from '@/types/CarDataSubmission/tabs/shared';
import { anyInDeltaRow } from '@/types/CarDataSubmission/tabs/deltas';
import type { ReturnedGetters } from '@/hooks/CarDataSubmission/useCarSeedFields/anyValue';

export function buildStatsPatch(car: Car, getters: ReturnedGetters): CarStatsPatch {
  const k     = car.normalizedKey ?? String(car.id);
  const stars = car.stars ?? 6;
  const stats: CarStatsPatch = {};

  const {
    getBps, getStock, getGold, getMax, getStageInputs,
    getCosts, getXp, getStageDeltas, getImportDeltas,
    hasUserStageDeltaEdits, hasUserImportDeltaEdits,
    getSeedStagesByStar,
  } = getters;

  const blockToStar = (b: StatBlockState): StarStatBlock | undefined => {
    const out: StarStatBlock = {};
    const r  = toNum(b.rank);     if (r  !== undefined) out.rank         = r;
    const ts = toNum(b.topSpeed); if (ts !== undefined) out.topSpeed     = ts;
    const a  = toNum(b.accel);    if (a  !== undefined) out.acceleration = a;
    const h  = toNum(b.handling); if (h  !== undefined) out.handling     = h;
    const n  = toNum(b.nitro);    if (n  !== undefined) out.nitro        = n;
    return Object.keys(out).length ? out : undefined;
  };

  const bp: Record<string, unknown> = {};
  getBps(k).forEach((v, i) => {
    const n = toNum(v); if (n !== undefined) bp[STAR_KEYS[i]] = n;
  });
  if (Object.keys(bp).length) stats.blueprints = bp;

  const ss = blockToStar(getStock(k)); if (ss) stats.stock = ss;
  const gs = blockToStar(getGold(k));  if (gs) stats.gold  = gs;

  const mx: CarStatsPatch['maxAtStar'] = {};
  getMax(k).forEach((b, i) => {
    const s = blockToStar(b); if (s) mx[STAR_KEYS[i]] = s;
  });
  if (Object.keys(mx).length) stats.maxAtStar = mx;

  // Stages — group by star key using seed stage numbers
  const si = getStageInputs(k);
  if (Object.keys(si).length) {
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

  // Credit costs
  const co: Record<string, unknown> = {};
  Object.entries(getCosts(k)).forEach(([stageNum, v]) => {
    const n = toNum(v); if (n !== undefined) co[stageNum] = n;
  });
  if (Object.keys(co).length) stats.creditCosts = co;

  // Garage Level XP
  const xp: Record<string, unknown> = {};
  Object.entries(getXp(k)).forEach(([stageNum, v]) => {
    const n = toNum(v); if (n !== undefined) xp[stageNum] = n;
  });
  if (Object.keys(xp).length) stats.garageLevelXp = xp;

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

  return stats;
}