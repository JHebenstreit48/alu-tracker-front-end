import type { ScaleMode, StatKey } from '@/types/CarLab/carLab';
import { formatDelta, formatPercent, formatStat } from '@/utils/carLab/values';

export function formatScaled(key: StatKey, value: number, scale: ScaleMode): string {
  if (scale === 'gain') return formatDelta(key, value);
  if (scale === 'pct') return formatPercent(value);
  return formatStat(key, value);
}