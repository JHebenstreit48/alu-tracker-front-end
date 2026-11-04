import { useId } from 'react';
import type { SimStep } from '@/types/CarLab/simulator';

interface Props {
  steps: SimStep[];
  index: number;
  onChange: (id: string) => void;
}

export default function StepSlider({ steps, index, onChange }: Props) {
  const id = useId();
  const current = steps[index];
  if (!current) return null;

  return (
    <div className="carLabField">
      <label className="carLabFieldLabel" htmlFor={id}>
        Upgrade step
      </label>
      <input
        id={id}
        className="carLabSimSlider"
        type="range"
        min={0}
        max={steps.length - 1}
        step={1}
        value={index}
        aria-valuetext={current.label}
        onChange={(event) => onChange(steps[Number(event.target.value)].id)}
      />
      <p className="carLabSimReadout">{current.label}</p>
      <p className="carLabResultsNote">
        {current.exact
          ? 'Logged data for this step.'
          : current.stats
            ? 'Estimated: a straight line between the nearest logged steps.'
            : 'No data yet beyond the last logged step.'}
      </p>
    </div>
  );
}