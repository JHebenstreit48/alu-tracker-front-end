import { useId } from 'react';
import type { CarLabPoint } from '@/types/CarLab/carLab';

interface Props {
  points: CarLabPoint[];
  value: string | undefined;
  onChange: (id: string) => void;
}

export default function PointSelect({ points, value, onChange }: Props) {
  const id = useId();
  return (
    <div className="carLabField">
      <label className="carLabFieldLabel" htmlFor={id}>
        Compare at
      </label>
      <select
        id={id}
        className="carLabSelect"
        disabled={points.length === 0}
        value={value ?? ''}
        onChange={(event) => onChange(event.target.value)}
      >
        {points.length === 0 && <option value="">No shared data points yet</option>}
        {points.map((point) => (
          <option key={point.id} value={point.id}>
            {point.label}
          </option>
        ))}
      </select>
    </div>
  );
}