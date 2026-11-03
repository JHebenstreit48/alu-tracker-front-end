import type { BarLayout } from '@/types/CarLab/compare';
import { CHART, seriesClass } from '@/utils/carLab/chartGeometry';
import ChartAxes from '@/components/CarLab/compare/svg/chartAxes';

interface Props {
  layout: BarLayout;
  label: string;
}

export default function BarChartSvg({ layout, label }: Props) {
  return (
    <svg viewBox={`0 0 ${CHART.width} ${CHART.height}`} role="img" aria-label={label}>
      <ChartAxes xTicks={layout.xTicks} yTicks={layout.yTicks} />
      {layout.bars.map((bar) => (
        <rect
          key={bar.id}
          className={`carLabBar ${seriesClass(bar.slot)}`}
          x={bar.x}
          y={bar.y}
          width={bar.width}
          height={bar.height}
        >
          <title>{bar.text}</title>
        </rect>
      ))}
    </svg>
  );
}