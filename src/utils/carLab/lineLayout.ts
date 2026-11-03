import type { CarLabCar, ScaleMode, StatKey } from '@/types/CarLab/carLab';
import type { ChartDot, ChartSegment, LineLayout, LineSeries, Slot } from '@/types/CarLab/compare';
import { niceDomain, stageTicks, xForStage, yFor, yTicksFor } from '@/utils/carLab/chartGeometry';
import { formatScaled } from '@/utils/carLab/formatScaled';
import { buildLadder, buildPoints, isNextStep } from '@/utils/carLab/points';
import { scaledValue } from '@/utils/carLab/values';

interface Sample {
  id: string;
  x: number;
  label: string;
  value: number;
}

function sample(car: CarLabCar, key: StatKey, scale: ScaleMode): Sample[] {
  return buildPoints(car).flatMap((point) => {
    const value = scaledValue(car, point, key, scale);
    return value === null ? [] : [{ id: point.id, x: point.x, label: point.label, value }];
  });
}

export function layoutLine(
  a: CarLabCar,
  b: CarLabCar,
  key: StatKey,
  scale: ScaleMode
): LineLayout | null {
  const entries: [Slot, CarLabCar, Sample[]][] = [
    ['a', a, sample(a, key, scale)],
    ['b', b, sample(b, key, scale)],
  ];
  const values = entries.flatMap(([, , samples]) => samples.map((s) => s.value));
  if (values.length === 0) return null;
  const domain = niceDomain(values);

  const series: LineSeries[] = entries.map(([slot, car, samples]) => {
    const ladder = [...buildLadder(car.maxStars), 'gold'];
    const dots: ChartDot[] = samples.map((s) => ({
      id: s.id,
      cx: xForStage(s.x),
      cy: yFor(domain, s.value),
      text: `${car.name} · ${s.label}: ${formatScaled(key, s.value, scale)}`,
    }));
    const segments: ChartSegment[] = dots.slice(1).map((dot, index) => {
      const from = dots[index];
      return {
        d: `M${from.cx} ${from.cy}L${dot.cx} ${dot.cy}`,
        gap: !isNextStep(ladder, from.id, dot.id),
      };
    });
    return { slot, segments, dots };
  });

  return {
    xTicks: stageTicks(),
    yTicks: yTicksFor(domain, key, scale),
    series,
  };
}