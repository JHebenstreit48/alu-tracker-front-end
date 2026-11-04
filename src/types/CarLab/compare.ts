import type { StatKey } from '@/types/CarLab/carLab';

export type Slot = 'a' | 'b';

export type Leader = Slot | 'tie';

export type ChartView = 'line' | 'bar';

export interface StatRow {
  key: StatKey;
  a: number;
  b: number;
  delta: number;
  leader: Leader;
}

export interface Verdict {
  lines: string[];
  overall: string | null;
  notes: string[];
}

export interface AxisTick {
  pos: number;
  label: string;
}

export interface ChartDot {
  id: string;
  cx: number;
  cy: number;
  text: string;
}

export interface ChartSegment {
  d: string;
  gap: boolean;
}

export interface LineSeries {
  slot: Slot;
  segments: ChartSegment[];
  dots: ChartDot[];
}

export interface LineLayout {
  xTicks: AxisTick[];
  yTicks: AxisTick[];
  series: LineSeries[];
}

export interface ChartBar {
  id: string;
  slot: Slot;
  x: number;
  y: number;
  width: number;
  height: number;
  text: string;
}

export interface BarLayout {
  xTicks: AxisTick[];
  yTicks: AxisTick[];
  bars: ChartBar[];
}