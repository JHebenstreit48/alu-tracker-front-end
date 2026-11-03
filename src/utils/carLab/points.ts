import type { CarLabCar, CarLabPoint } from '@/types/CarLab/carLab';
import {
  GOLD_X,
  STAGE_AT_STAR,
  getLastStage,
  getStageCaps,
  starForBoundaryStage,
} from '@/utils/carLab/getStageCaps';

export const stagePointId = (stage: number): string => `stage-${stage}`;
export const starPointId = (star: number): string => `star-${star}`;

export function buildPoints(car: CarLabCar): CarLabPoint[] {
  const points: CarLabPoint[] = [];

  if (car.stock) {
    points.push({ id: 'stock', kind: 'stock', x: 0, order: 0, label: 'Stock', stats: car.stock });
  }

  Object.entries(car.stages).forEach(([key, stats]) => {
    const stage = Number(key);
    const closesTier = starForBoundaryStage(stage, car.maxStars) !== null;
    points.push({
      id: stagePointId(stage),
      kind: 'stage',
      x: stage,
      order: stage,
      label: closesTier ? `Stage ${stage} (before imports)` : `Stage ${stage}`,
      stats,
    });
  });

  Object.entries(car.checkpoints).forEach(([key, stats]) => {
    const star = Number(key);
    const stage = STAGE_AT_STAR[star];
    if (stage === undefined) return;
    points.push({
      id: starPointId(star),
      kind: 'star',
      x: stage,
      order: stage + 0.5,
      label: star === 6 ? '\u26056 (no EIPs)' : `\u2605${star}`,
      stats,
    });
  });

  if (car.gold) {
    points.push({ id: 'gold', kind: 'gold', x: GOLD_X, order: 99, label: 'Gold max', stats: car.gold });
  }

  return points.sort((a, b) => a.order - b.order);
}

export function findPoint(points: CarLabPoint[], id: string): CarLabPoint | undefined {
  return points.find((p) => p.id === id);
}

export function sharedPoints(a: CarLabPoint[], b: CarLabPoint[]): CarLabPoint[] {
  return a.filter((p) => b.some((q) => q.id === p.id));
}

export function buildLadder(maxStars: number): string[] {
  const ids = ['stock'];
  const caps = getStageCaps(maxStars);
  const last = getLastStage(maxStars);
  for (let stage = 1; stage <= last; stage += 1) {
    ids.push(stagePointId(stage));
    caps.filter((c) => c.stage === stage).forEach((c) => ids.push(starPointId(c.star)));
  }
  return ids;
}

export function isNextStep(ladder: string[], fromId: string, toId: string): boolean {
  const from = ladder.indexOf(fromId);
  const to = ladder.indexOf(toId);
  return from >= 0 && to === from + 1;
}