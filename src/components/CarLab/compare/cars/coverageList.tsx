import type { CarLabCar } from '@/types/CarLab/carLab';

interface Props {
  car: CarLabCar | null;
  loading: boolean;
  error: string | null;
}

function buildRows(car: CarLabCar): { text: string; has: boolean }[] {
  const stages = Object.keys(car.stages).length;
  const stars = Object.keys(car.checkpoints)
    .map(Number)
    .sort((x, y) => x - y)
    .map((star) => `★${star}`);
  return [
    { text: car.stock ? 'Stock' : 'Stock: not added yet', has: Boolean(car.stock) },
    { text: stages ? `Stages (${stages})` : 'Stages: not added yet', has: stages > 0 },
    {
      text: stars.length ? `Star checkpoints ${stars.join(' ')}` : 'Star checkpoints: not added yet',
      has: stars.length > 0,
    },
    { text: car.gold ? 'Gold max' : 'Gold max: not added yet', has: Boolean(car.gold) },
  ];
}

export default function CoverageList({ car, loading, error }: Props) {
  if (error) return <p className="carLabEmpty">{error}</p>;
  if (loading || !car) return <p className="carLabEmpty">Loading data…</p>;

  return (
    <ul className="carLabCoverage" aria-label="Data logged for this car">
      {buildRows(car).map((row) => (
        <li key={row.text} className={row.has ? 'has' : undefined}>
          <span className="carLabCoverageMark" aria-hidden="true">
            {row.has ? '✓' : '–'}
          </span>
          {row.text}
        </li>
      ))}
    </ul>
  );
}