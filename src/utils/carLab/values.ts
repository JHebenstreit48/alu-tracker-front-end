import type { CarLabCar, CarLabPoint, ScaleMode, StatKey } from '@/types/CarLab/carLab';

export const STAT_KEYS: readonly StatKey[] = [
  'rank',
  'topSpeed',
  'acceleration',
  'handling',
  'nitro',
];

export const STAT_LABELS: Record<StatKey, string> = {
  rank: 'Rank',
  topSpeed: 'Top speed',
  acceleration: 'Acceleration',
  handling: 'Handling',
  nitro: 'Nitro',
};

export function scaledValue(
  car: CarLabCar,
  point: CarLabPoint,
  key: StatKey,
  scale: ScaleMode
): number | null {
  const value = point.stats[key];
  if (scale === 'abs') return value;

  const base = car.stock?.[key];
  if (base === undefined) return null;
  if (scale === 'gain') return value - base;

  const top = car.gold?.[key];
  if (top === undefined || top === base) return null;
  return ((value - base) / (top - base)) * 100;
}

export function formatStat(key: StatKey, value: number): string {
  if (key === 'rank') return String(Math.round(value));
  if (key === 'topSpeed') {
    const isTenth = Math.abs(value * 10 - Math.round(value * 10)) < 1e-6;
    return isTenth ? value.toFixed(1) : value.toFixed(2);
  }
  return value.toFixed(2);
}

export function formatDelta(key: StatKey, delta: number): string {
  const sign = delta > 0 ? '+' : delta < 0 ? '\u2212' : '\u00b1';
  const size = Math.abs(delta);
  return sign + (key === 'rank' ? String(Math.round(size)) : size.toFixed(2));
}

export function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`;
}