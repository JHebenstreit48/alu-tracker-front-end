import type { CarLabPoint, ScaleMode, StatKey } from '@/types/CarLab/carLab';
import type { AxisTick, Slot } from '@/types/CarLab/compare';
import { GOLD_X } from '@/utils/carLab/getStageCaps';
import { formatScaled } from '@/utils/carLab/formatScaled';

export const CHART = { width: 640, height: 320, left: 64, right: 16, top: 16, bottom: 36 } as const;

export const plotWidth = CHART.width - CHART.left - CHART.right;
export const plotHeight = CHART.height - CHART.top - CHART.bottom;

export interface Domain {
  min: number;
  max: number;
  ticks: number[];
}

export function niceDomain(values: number[], count = 5): Domain {
  const low = Math.min(...values);
  const high = Math.max(...values);
  const range = high - low || Math.abs(high) * 0.1 || 1;
  const rough = range / (count - 1);
  const magnitude = 10 ** Math.floor(Math.log10(rough));
  const norm = rough / magnitude;
  const step = (norm <= 1 ? 1 : norm <= 2 ? 2 : norm <= 5 ? 5 : 10) * magnitude;
  const min = Math.floor(low / step) * step;
  const max = Math.ceil(high / step) * step;
  const ticks: number[] = [];
  for (let v = min; v <= max + step / 2; v += step) ticks.push(Number(v.toFixed(10)));
  return { min, max: ticks[ticks.length - 1], ticks };
}

export function yFor(domain: Domain, value: number): number {
  const span = domain.max - domain.min || 1;
  return CHART.top + (1 - (value - domain.min) / span) * plotHeight;
}

export function xForStage(stage: number): number {
  return CHART.left + (stage / GOLD_X) * plotWidth;
}

export function yTicksFor(domain: Domain, key: StatKey, scale: ScaleMode): AxisTick[] {
  return domain.ticks.map((v) => ({ pos: yFor(domain, v), label: formatScaled(key, v, scale) }));
}

export function stageTicks(): AxisTick[] {
  return Array.from({ length: GOLD_X + 1 }, (_, stage) => ({
    pos: xForStage(stage),
    label: stage === 0 ? 'Stock' : stage === GOLD_X ? 'Gold' : String(stage),
  }));
}

export function shortLabel(point: CarLabPoint): string {
  if (point.kind === 'stock') return 'Stock';
  if (point.kind === 'gold') return 'Gold';
  if (point.kind === 'star') return `★${point.id.replace('star-', '')}`;
  return `S${point.x}`;
}

export const seriesClass = (slot: Slot): string => (slot === 'a' ? 'seriesA' : 'seriesB');