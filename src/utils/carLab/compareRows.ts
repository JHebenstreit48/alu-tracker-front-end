import type { CarLabPoint } from '@/types/CarLab/carLab';
import type { Leader, StatRow } from '@/types/CarLab/compare';
import { STAT_KEYS } from '@/utils/carLab/values';

const EPSILON = 1e-9;

export function compareStats(a: CarLabPoint, b: CarLabPoint): StatRow[] {
  return STAT_KEYS.map((key) => {
    const left = a.stats[key];
    const right = b.stats[key];
    const delta = left - right;
    const leader: Leader = Math.abs(delta) < EPSILON ? 'tie' : delta > 0 ? 'a' : 'b';
    return { key, a: left, b: right, delta, leader };
  });
}

export function tallyRows(rows: StatRow[]): { a: number; b: number; tie: number } {
  return rows.reduce(
    (sum, row) => ({
      a: sum.a + (row.leader === 'a' ? 1 : 0),
      b: sum.b + (row.leader === 'b' ? 1 : 0),
      tie: sum.tie + (row.leader === 'tie' ? 1 : 0),
    }),
    { a: 0, b: 0, tie: 0 }
  );
}