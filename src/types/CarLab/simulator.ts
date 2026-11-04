import type { StatSet } from '@/types/CarLab/carLab';
import type { AxisTick, ChartSegment } from '@/types/CarLab/compare';

export interface SimStep {
  id: string;
  label: string;
  pos: number;
  exact: boolean;
  stats: StatSet | null;
}

export interface SimulatedState {
  steps: SimStep[];
  exactCount: number;
}

export interface SimDot {
  cx: number;
  cy: number;
}

export interface SimChartLayout {
  xTicks: AxisTick[];
  yTicks: AxisTick[];
  segments: ChartSegment[];
  area: string;
  dots: SimDot[];
  marker: SimDot | null;
  guideX: number | null;
  value: number | null;
  exact: boolean;
}