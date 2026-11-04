import type { Car, FullCar } from '@/types/shared/car';
import type { CarLabCar, CarLabListItem, StatKey, StatSet } from '@/types/CarLab/carLab';
import { STAT_KEYS } from '@/utils/carLab/values';
import { getCarImageUrl } from '@/utils/shared/imageUrl';

type Raw = Record<string, unknown>;

const SUFFIX: Record<StatKey, string> = {
  rank: 'Rank',
  topSpeed: 'TopSpeed',
  acceleration: 'Acceleration',
  handling: 'Handling',
  nitro: 'Nitro',
};

const STAR_WORD = ['', 'one', 'two', 'three', 'four', 'five', 'six'];

function resolveImage(raw: string | undefined): string | undefined {
  const value = (raw ?? '').trim();
  if (!value) return undefined;
  if (/^https?:\/\//i.test(value) || value.startsWith('data:')) return value;
  return getCarImageUrl(value);
}

function loggedNumber(raw: Raw, key: string): number | undefined {
  const value = raw[key];
  return typeof value === 'number' && Number.isFinite(value) && value > 0 ? value : undefined;
}

function readSet(raw: Raw, keyFor: (stat: StatKey) => string): StatSet | undefined {
  const out: Partial<StatSet> = {};
  for (const stat of STAT_KEYS) {
    const value = loggedNumber(raw, keyFor(stat));
    if (value === undefined) return undefined;
    out[stat] = value;
  }
  return out as StatSet;
}

function readCheckpoints(raw: Raw, maxStars: number): Record<number, StatSet> {
  const out: Record<number, StatSet> = {};
  for (let star = 1; star <= maxStars; star += 1) {
    const set = readSet(raw, (stat) => `${STAR_WORD[star]}StarMax${SUFFIX[stat]}`);
    if (set) out[star] = set;
  }
  return out;
}

function readStages(raw: Raw): Record<number, StatSet> {
  const out: Record<number, StatSet> = {};
  const list = raw.stages;
  if (!Array.isArray(list)) return out;
  list.forEach((item: unknown) => {
    if (typeof item !== 'object' || item === null) return;
    const row = item as Raw;
    const set = readSet(row, (stat) => stat);
    if (typeof row.stage === 'number' && set) out[row.stage] = set;
  });
  return out;
}

export function mapListItem(car: Car): CarLabListItem | null {
  if (!car.normalizedKey) return null;
  return {
    slug: car.normalizedKey,
    name: `${car.brand} ${car.model}`.trim(),
    carClass: car.class,
    rarity: car.rarity,
    maxStars: car.stars,
    keyCar: car.keyCar,
    image: resolveImage(car.image),
  };
}

export function mapFullCar(slug: string, car: FullCar): CarLabCar {
  const raw = car as unknown as Raw;
  const maxStars = typeof raw.stars === 'number' ? raw.stars : 0;

  return {
    slug,
    name: `${String(raw.brand ?? '')} ${String(raw.model ?? '')}`.trim(),
    carClass: String(raw.class ?? ''),
    rarity: String(raw.rarity ?? ''),
    maxStars,
    keyCar: typeof raw.keyCar === 'boolean' ? raw.keyCar : undefined,
    image: resolveImage(typeof raw.image === 'string' ? raw.image : undefined),
    stock: readSet(raw, (stat) => `stock${SUFFIX[stat]}`),
    gold: readSet(raw, (stat) => (stat === 'rank' ? 'goldMaxRank' : `gold${SUFFIX[stat]}`)),
    checkpoints: readCheckpoints(raw, maxStars),
    stages: readStages(raw),
  };
}