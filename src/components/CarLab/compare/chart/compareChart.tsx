import { useMemo } from 'react';
import type { CarLabCar, ScaleMode, StatKey } from '@/types/CarLab/carLab';
import type { ChartView } from '@/types/CarLab/compare';
import BarChartSvg from '@/components/CarLab/compare/svg/barChartSvg';
import LineChartSvg from '@/components/CarLab/compare/svg/lineChartSvg';
import { layoutBars } from '@/utils/carLab/barLayout';
import { layoutLine } from '@/utils/carLab/lineLayout';
import { STAT_LABELS } from '@/utils/carLab/values';

interface Props {
  a: CarLabCar;
  b: CarLabCar;
  stat: StatKey;
  scale: ScaleMode;
  view: ChartView;
}

export default function CompareChart({ a, b, stat, scale, view }: Props) {
  const line = useMemo(
    () => (view === 'line' ? layoutLine(a, b, stat, scale) : null),
    [a, b, stat, scale, view]
  );
  const bars = useMemo(
    () => (view === 'bar' ? layoutBars(a, b, stat, scale) : null),
    [a, b, stat, scale, view]
  );
  const label = `${STAT_LABELS[stat]} for ${a.name} and ${b.name}`;
  const hasChart = view === 'line' ? line !== null : bars !== null;

  return (
    <div>
      <div className="carLabLegend">
        <span className="carLabLegendItem seriesA">{a.name}</span>
        <span className="carLabLegendItem seriesB">{b.name}</span>
        {view === 'line' && (
          <span className="carLabLegendItem keyDashed">Dashed = steps skipped, no data</span>
        )}
      </div>
      {hasChart ? (
        <div className="carLabChart">
          {line && <LineChartSvg layout={line} label={label} />}
          {bars && <BarChartSvg layout={bars} label={label} />}
        </div>
      ) : (
        <p className="carLabEmpty">
          Not enough data to draw this chart. Try Actual values, or another stat or view.
        </p>
      )}
      <ul className="carLabNotes">
        {view === 'line' && (
          <li>Each dot is a logged point. Lines never invent values between them.</li>
        )}
        {view === 'bar' && <li>Bars only show points both cars have logged.</li>}
        {view === 'bar' && scale === 'abs' && (
          <li>Bars start at the lowest axis value, not at zero.</li>
        )}
        <li>Stage points at a star boundary are before imports.</li>
      </ul>
    </div>
  );
}