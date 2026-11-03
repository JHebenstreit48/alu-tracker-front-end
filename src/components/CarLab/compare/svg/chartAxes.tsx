import type { AxisTick } from '@/types/CarLab/compare';
import { CHART } from '@/utils/carLab/chartGeometry';

interface Props {
  xTicks: AxisTick[];
  yTicks: AxisTick[];
  guides?: boolean;
}

const RIGHT = CHART.width - CHART.right;
const BOTTOM = CHART.height - CHART.bottom;

export default function ChartAxes({ xTicks, yTicks, guides = false }: Props) {
  return (
    <g>
      {yTicks.map((tick) => (
        <g key={`y-${tick.pos}`}>
          <line className="carLabGridLine" x1={CHART.left} x2={RIGHT} y1={tick.pos} y2={tick.pos} />
          <text className="carLabAxisText axisY" x={CHART.left - 8} y={tick.pos + 4}>
            {tick.label}
          </text>
        </g>
      ))}
      {xTicks.map((tick) => (
        <g key={`x-${tick.pos}`}>
          {guides && (
            <line className="carLabGuideLine" x1={tick.pos} x2={tick.pos} y1={CHART.top} y2={BOTTOM} />
          )}
          <text className="carLabAxisText axisX" x={tick.pos} y={BOTTOM + 20}>
            {tick.label}
          </text>
        </g>
      ))}
    </g>
  );
}