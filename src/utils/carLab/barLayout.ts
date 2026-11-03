import type { CarLabCar, ScaleMode, StatKey } from '@/types/CarLab/carLab';
import type { AxisTick, BarLayout, ChartBar } from '@/types/CarLab/compare';
import { CHART, niceDomain, plotWidth, shortLabel, yFor, yTicksFor } from '@/utils/carLab/chartGeometry';
import { formatScaled } from '@/utils/carLab/formatScaled';
import { buildPoints, findPoint, sharedPoints } from '@/utils/carLab/points';
import { scaledValue } from '@/utils/carLab/values';

export function layoutBars(
  a: CarLabCar,
  b: CarLabCar,
  key: StatKey,
  scale: ScaleMode
): BarLayout | null {
  const pointsA = buildPoints(a);
  const pointsB = buildPoints(b);
  const shared = sharedPoints(pointsA, pointsB);

  const groups = shared.flatMap((shown) => {
    const pa = findPoint(pointsA, shown.id);
    const pb = findPoint(pointsB, shown.id);
    if (!pa || !pb) return [];
    const va = scaledValue(a, pa, key, scale);
    const vb = scaledValue(b, pb, key, scale);
    return va === null || vb === null ? [] : [{ point: shown, va, vb }];
  });
  if (groups.length === 0) return null;

  const values = groups.flatMap((g) => [g.va, g.vb]);
  const low = Math.min(...values);
  const pad = (Math.max(...values) - low) * 0.1 || Math.abs(low) * 0.05 || 1;
  const domain = niceDomain(scale === 'abs' ? [low - pad, ...values] : [0, ...values]);
  const base = scale === 'abs' ? domain.min : 0;
  const baseY = yFor(domain, base);
  const slotWidth = plotWidth / groups.length;
  const width = Math.min(26, slotWidth * 0.36);

  const bars: ChartBar[] = [];
  const xTicks: AxisTick[] = [];
  groups.forEach((group, index) => {
    const center = CHART.left + slotWidth * (index + 0.5);
    xTicks.push({ pos: center, label: shortLabel(group.point) });
    ([['a', a, group.va, -width - 1], ['b', b, group.vb, 1]] as const).forEach(
      ([slot, car, value, offset]) => {
        const top = yFor(domain, value);
        bars.push({
          id: `${group.point.id}-${slot}`,
          slot,
          x: center + offset,
          y: Math.min(top, baseY),
          width,
          height: Math.max(Math.abs(baseY - top), 1),
          text: `${car.name} · ${group.point.label}: ${formatScaled(key, value, scale)}`,
        });
      }
    );
  });

  return { xTicks, yTicks: yTicksFor(domain, key, scale), bars };
}