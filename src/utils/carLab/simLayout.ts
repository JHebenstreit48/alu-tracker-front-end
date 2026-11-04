import type { StatKey } from '@/types/CarLab/carLab';
import type { SimChartLayout, SimulatedState } from '@/types/CarLab/simulator';
import { niceDomain } from '@/utils/carLab/chartGeometry';
import { GOLD_X } from '@/utils/carLab/getStageCaps';
import { formatStat } from '@/utils/carLab/values';

export const SIM = { width: 320, height: 190, left: 52, right: 12, top: 14, bottom: 26 } as const;

const PLOT_W = SIM.width - SIM.left - SIM.right;
const PLOT_H = SIM.height - SIM.top - SIM.bottom;
const BASE_Y = SIM.height - SIM.bottom;

const xFor = (pos: number): number => SIM.left + (pos / GOLD_X) * PLOT_W;

export function layoutSimStat(
  state: SimulatedState,
  key: StatKey,
  selected: number
): SimChartLayout | null {
  const pts = state.steps.flatMap((step, index) =>
    step.stats ? [{ index, exact: step.exact, pos: step.pos, value: step.stats[key] }] : []
  );
  if (pts.length === 0) return null;

  const domain = niceDomain(
    pts.map((p) => p.value),
    4
  );
  const span = domain.max - domain.min || 1;
  const yFor = (value: number): number => SIM.top + (1 - (value - domain.min) / span) * PLOT_H;
  const placed = pts.map((p) => ({ ...p, cx: xFor(p.pos), cy: yFor(p.value) }));

  const segments = placed.slice(1).map((p, i) => {
    const from = placed[i];
    return { d: `M${from.cx} ${from.cy}L${p.cx} ${p.cy}`, gap: !(from.exact && p.exact) };
  });

  const shaded = placed.filter((p) => p.index <= selected);
  const area =
    shaded.length < 2
      ? ''
      : `M${shaded[0].cx} ${BASE_Y}` +
        shaded.map((p) => `L${p.cx} ${p.cy}`).join('') +
        `L${shaded[shaded.length - 1].cx} ${BASE_Y}Z`;

  const current = placed.find((p) => p.index === selected);
  const step = state.steps[selected];

  return {
    xTicks: [
      { pos: xFor(0), label: 'Stock' },
      { pos: xFor(GOLD_X), label: 'Gold' },
    ],
    yTicks: domain.ticks.map((t) => ({ pos: yFor(t), label: formatStat(key, t) })),
    segments,
    area,
    dots: placed.filter((p) => p.exact).map((p) => ({ cx: p.cx, cy: p.cy })),
    marker: current ? { cx: current.cx, cy: current.cy } : null,
    guideX: step ? xFor(step.pos) : null,
    value: current ? current.value : null,
    exact: step ? step.exact : false,
  };
}