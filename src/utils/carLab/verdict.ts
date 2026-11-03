import type { CarLabCar, CarLabPoint } from '@/types/CarLab/carLab';
import type { Verdict } from '@/types/CarLab/compare';
import { compareStats, tallyRows } from '@/utils/carLab/compareRows';
import { findPoint, sharedPoints } from '@/utils/carLab/points';

interface Milestone {
  id: string;
  title: string;
}

function pickMilestones(shared: CarLabPoint[]): Milestone[] {
  const out: Milestone[] = [];
  if (shared.some((p) => p.id === 'stock')) out.push({ id: 'stock', title: 'Stock' });
  const topStar = shared.filter((p) => p.kind === 'star').pop();
  if (topStar) out.push({ id: topStar.id, title: `Max star (${topStar.label})` });
  if (shared.some((p) => p.id === 'gold')) out.push({ id: 'gold', title: 'Gold max' });
  return out;
}

function missingNotes(a: CarLabCar, b: CarLabCar): string[] {
  const notes: string[] = [];
  const checks: [string, (car: CarLabCar) => boolean][] = [
    ['Stock', (car) => Boolean(car.stock)],
    ['Gold max', (car) => Boolean(car.gold)],
  ];
  checks.forEach(([title, has]) => {
    [a, b].forEach((car) => {
      if (!has(car)) notes.push(`${title} is not added yet for ${car.name}, so it is not compared.`);
    });
  });
  return notes;
}

function growthNote(a: CarLabCar, b: CarLabCar): string | null {
  if (!a.stock || !a.gold || !b.stock || !b.gold) return null;
  const gainA = a.gold.rank - a.stock.rank;
  const gainB = b.gold.rank - b.stock.rank;
  return `Rank growth from stock to gold max: ${a.name} +${Math.round(gainA)}, ${b.name} +${Math.round(gainB)}.`;
}

export function buildVerdict(
  a: CarLabCar,
  b: CarLabCar,
  pointsA: CarLabPoint[],
  pointsB: CarLabPoint[]
): Verdict {
  const shared = sharedPoints(pointsA, pointsB);
  const milestones = pickMilestones(shared);
  const total = { a: 0, b: 0 };
  const lines: string[] = [];

  milestones.forEach(({ id, title }) => {
    const pa = findPoint(pointsA, id);
    const pb = findPoint(pointsB, id);
    if (!pa || !pb) return;
    const score = tallyRows(compareStats(pa, pb));
    total.a += score.a;
    total.b += score.b;
    if (score.a === score.b) lines.push(`${title}: even, ${score.a} stats each.`);
    else {
      const winner = score.a > score.b ? a.name : b.name;
      const high = Math.max(score.a, score.b);
      const low = Math.min(score.a, score.b);
      lines.push(`${title}: ${winner} leads, ${high} stats to ${low}.`);
    }
  });

  const notes = missingNotes(a, b);
  if (a.carClass !== b.carClass) {
    notes.push(
      `${a.name} is class ${a.carClass} and ${b.name} is class ${b.carClass}, so raw stats are not like-for-like.`
    );
  }
  const growth = growthNote(a, b);
  if (growth) notes.push(growth);

  let overall: string | null = null;
  if (milestones.length > 0) {
    const count = milestones.length;
    const detail = `${Math.max(total.a, total.b)} stat wins to ${Math.min(total.a, total.b)} across ${count} checkpoint${count === 1 ? '' : 's'}`;
    if (total.a === total.b) overall = `Overall: too close to call (${detail}).`;
    else overall = `Overall: ${total.a > total.b ? a.name : b.name} comes out ahead (${detail}).`;
  }
  return { lines, overall, notes };
}