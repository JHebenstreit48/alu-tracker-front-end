import type { ScaleMode, StatKey } from '@/types/CarLab/carLab';
import type { ChartView } from '@/types/CarLab/compare';
import { STAT_KEYS, STAT_LABELS } from '@/utils/carLab/values';

interface Props {
  stat: StatKey;
  scale: ScaleMode;
  view: ChartView;
  canGain: boolean;
  canPct: boolean;
  onStat: (stat: StatKey) => void;
  onScale: (scale: ScaleMode) => void;
  onView: (view: ChartView) => void;
}

interface Option<T extends string> {
  id: T;
  label: string;
  disabled?: boolean;
}

function Segment<T extends string>(props: {
  label: string;
  value: T;
  options: Option<T>[];
  onChange: (id: T) => void;
}) {
  return (
    <div className="carLabField">
      <span className="carLabFieldLabel">{props.label}</span>
      <div className="carLabSegment" role="group" aria-label={props.label}>
        {props.options.map((option) => (
          <button
            key={option.id}
            type="button"
            className="carLabSegmentButton"
            aria-pressed={props.value === option.id}
            disabled={option.disabled}
            onClick={() => props.onChange(option.id)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function ChartControls(props: Props) {
  const { stat, scale, view, canGain, canPct, onStat, onScale, onView } = props;
  return (
    <div className="carLabToolbar">
      <div className="carLabField">
        <label className="carLabFieldLabel" htmlFor="carLabStat">
          Stat
        </label>
        <select
          id="carLabStat"
          className="carLabSelect"
          value={stat}
          onChange={(event) => onStat(event.target.value as StatKey)}
        >
          {STAT_KEYS.map((key) => (
            <option key={key} value={key}>
              {STAT_LABELS[key]}
            </option>
          ))}
        </select>
      </div>
      <Segment<ScaleMode>
        label="Values"
        value={scale}
        onChange={onScale}
        options={[
          { id: 'abs', label: 'Actual' },
          { id: 'gain', label: 'Gain vs stock', disabled: !canGain },
          { id: 'pct', label: '% of stock → gold', disabled: !canPct },
        ]}
      />
      <Segment<ChartView>
        label="Chart"
        value={view}
        onChange={onView}
        options={[
          { id: 'line', label: 'Line' },
          { id: 'bar', label: 'Bar' },
        ]}
      />
    </div>
  );
}