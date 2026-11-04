import { GOLD_X, STAGE_AT_STAR, starForBoundaryStage } from '@/utils/carLab/getStageCaps';

export function stepPos(id: string): number {
  if (id === 'stock') return 0;
  if (id === 'gold') return GOLD_X;
  const [kind, raw] = id.split('-');
  const n = Number(raw);
  if (kind === 'stage') return n;
  return (STAGE_AT_STAR[n] ?? 0) + 0.5;
}

export function stepLabel(id: string, maxStars: number): string {
  if (id === 'stock') return 'Stock';
  if (id === 'gold') return 'Gold max';
  const [kind, raw] = id.split('-');
  const n = Number(raw);
  if (kind === 'star') return n === 6 ? '★6 (no EIPs)' : `★${n}`;
  return starForBoundaryStage(n, maxStars) !== null ? `Stage ${n} (before imports)` : `Stage ${n}`;
}