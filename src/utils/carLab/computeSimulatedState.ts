import type { CarLabCar, StatSet } from '@/types/CarLab/carLab';
import type { SimStep, SimulatedState } from '@/types/CarLab/simulator';
import { buildLadder, buildPoints } from '@/utils/carLab/points';
import { stepLabel, stepPos } from '@/utils/carLab/simSteps';
import { STAT_KEYS } from '@/utils/carLab/values';

function interpolate(pos: number, anchors: SimStep[]): StatSet | null {
  const before = anchors.filter((a) => a.pos <= pos).pop();
  const after = anchors.find((a) => a.pos >= pos);
  if (!before?.stats || !after?.stats) return null;
  const span = after.pos - before.pos;
  const ratio = span === 0 ? 0 : (pos - before.pos) / span;
  const out: Partial<StatSet> = {};
  for (const key of STAT_KEYS) {
    out[key] = before.stats[key] + (after.stats[key] - before.stats[key]) * ratio;
  }
  return out as StatSet;
}

export function computeSimulatedState(car: CarLabCar): SimulatedState {
  const known = new Map(buildPoints(car).map((p) => [p.id, p.stats]));
  const ids = [...buildLadder(car.maxStars), 'gold'];
  const base: SimStep[] = ids.map((id) => ({
    id,
    label: stepLabel(id, car.maxStars),
    pos: stepPos(id),
    exact: known.has(id),
    stats: known.get(id) ?? null,
  }));
  const anchors = base.filter((step) => step.exact);
  const steps = base.map((step) =>
    step.exact ? step : { ...step, stats: interpolate(step.pos, anchors) }
  );
  return { steps, exactCount: anchors.length };
}