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

  const si = getStageInputs(k);
  const st: Record<string, unknown> = {};
  Object.entries(si).forEach(([stageNum, entry]) => {
    const out: Record<string, unknown> = {};
    const r  = toNum(entry.rank);     if (r  !== undefined) out.rank         = r;
    const ts = toNum(entry.topSpeed); if (ts !== undefined) out.topSpeed     = ts;
    const a  = toNum(entry.accel);    if (a  !== undefined) out.acceleration = a;
    const h  = toNum(entry.handling); if (h  !== undefined) out.handling     = h;
    const n  = toNum(entry.nitro);    if (n  !== undefined) out.nitro        = n;
    if (Object.keys(out).length) st[stageNum] = out;
  });
  if (Object.keys(st).length) stats.stages = st;

  const co: Record<string, unknown> = {};
  Object.entries(getCosts(k)).forEach(([stageNum, v]) => {
    const n = toNum(v); if (n !== undefined) co[stageNum] = n;
  });
  if (Object.keys(co).length) stats.importPartsUpgrades = co;

  const xp: Record<string, unknown> = {};
  Object.entries(getXp(k)).forEach(([stageNum, v]) => {
    const n = toNum(v); if (n !== undefined) xp[stageNum] = n;
  });
  if (Object.keys(xp).length) stats.garageLevelXp = xp;

  const sdOut: DeltasByStar = {};
  getStageDeltas(k).slice(0, stars).forEach((rows, i) => {
    const entries = rows.filter(anyInDeltaRow).map((row) => {
      const entry: any = { stage: row.stage };
      const rb = {
        topSpeed: toNum(row.rankTopSpeed), acceleration: toNum(row.rankAccel),
        handling: toNum(row.rankHandling), nitro: toNum(row.rankNitro),
      };
      const sb = {
        topSpeed: toNum(row.statTopSpeed), acceleration: toNum(row.statAccel),
        handling: toNum(row.statHandling), nitro: toNum(row.statNitro),
      };
      if (Object.values(rb).some((v) => v !== undefined)) entry.rankByStat = rb;
      if (Object.values(sb).some((v) => v !== undefined)) entry.statByStat = sb;
      return entry;
    });
    if (entries.length) (sdOut as any)[STAR_KEYS[i]] = entries;
  });
  if (Object.keys(sdOut).length) stats.stageDeltas = sdOut;

  const idOut: DeltasByStar = {};
  getImportDeltas(k).slice(0, stars).forEach((rows, i) => {
    const entries = rows.filter(anyInDeltaRow).map((row) => {
      const entry: any = { stage: row.stage };
      if ('rarity' in row && row.rarity) entry.rarity = row.rarity;
      const rb = {
        topSpeed: toNum(row.rankTopSpeed), acceleration: toNum(row.rankAccel),
        handling: toNum(row.rankHandling), nitro: toNum(row.rankNitro),
      };
      const sb = {
        topSpeed: toNum(row.statTopSpeed), acceleration: toNum(row.statAccel),
        handling: toNum(row.statHandling), nitro: toNum(row.statNitro),
      };
      if (Object.values(rb).some((v) => v !== undefined)) entry.rankByStat = rb;
      if (Object.values(sb).some((v) => v !== undefined)) entry.statByStat = sb;
      return entry;
    });
    if (entries.length) (idOut as any)[STAR_KEYS[i]] = entries;
  });
  if (Object.keys(idOut).length) stats.importDeltas = idOut;

  return stats;
}