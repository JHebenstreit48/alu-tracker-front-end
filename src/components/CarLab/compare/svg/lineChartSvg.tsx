import type { LineLayout } from '@/types/CarLab/compare';
import { CHART, seriesClass } from '@/utils/carLab/chartGeometry';
import ChartAxes from '@/components/CarLab/compare/svg/chartAxes';

interface Props {
  layout: LineLayout;
  label: string;
}

export default function LineChartSvg({ layout, label }: Props) {
  return (
    <svg viewBox={`0 0 ${CHART.width} ${CHART.height}`} role="img" aria-label={label}>
      <ChartAxes xTicks={layout.xTicks} yTicks={layout.yTicks} guides />
      {layout.series.map((series) => (
        <g key={series.slot}>
          {series.segments.map((segment) => (
            <path
              key={segment.d}
              className={`carLabLine ${seriesClass(series.slot)}${segment.gap ? ' isGap' : ''}`}
              d={segment.d}
            />
          ))}
          {series.dots.map((dot) => (
            <circle
              key={dot.id}
              className={`carLabMark ${seriesClass(series.slot)}`}
              cx={dot.cx}
              cy={dot.cy}
              r={4.5}
            >
              <title>{dot.text}</title>
            </circle>
          ))}
        </g>
      ))}
    </svg>
  );
}