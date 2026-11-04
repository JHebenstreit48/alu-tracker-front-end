import type { SimChartLayout } from '@/types/CarLab/simulator';
import { SIM } from '@/utils/carLab/simLayout';

interface Props {
  layout: SimChartLayout;
  label: string;
}

const RIGHT = SIM.width - SIM.right;
const BOTTOM = SIM.height - SIM.bottom;

export default function SimSvg({ layout, label }: Props) {
  return (
    <svg viewBox={`0 0 ${SIM.width} ${SIM.height}`} role="img" aria-label={label}>
      {layout.yTicks.map((tick) => (
        <g key={`y-${tick.pos}`}>
          <line className="carLabGridLine" x1={SIM.left} x2={RIGHT} y1={tick.pos} y2={tick.pos} />
          <text className="carLabAxisText axisY" x={SIM.left - 6} y={tick.pos + 4}>
            {tick.label}
          </text>
        </g>
      ))}
      {layout.xTicks.map((tick) => (
        <text key={tick.label} className="carLabAxisText axisX" x={tick.pos} y={BOTTOM + 16}>
          {tick.label}
        </text>
      ))}
      {layout.area && <path className="carLabSimArea" d={layout.area} />}
      {layout.guideX !== null && (
        <line className="carLabSimGuide" x1={layout.guideX} x2={layout.guideX} y1={SIM.top} y2={BOTTOM} />
      )}
      {layout.segments.map((segment) => (
        <path
          key={segment.d}
          className={`carLabSimLine${segment.gap ? ' isGap' : ''}`}
          d={segment.d}
        />
      ))}
      {layout.dots.map((dot) => (
        <circle key={`${dot.cx}-${dot.cy}`} className="carLabSimMarker" cx={dot.cx} cy={dot.cy} r={3} />
      ))}
      {layout.marker && (
        <circle className="carLabSimMarker" cx={layout.marker.cx} cy={layout.marker.cy} r={6} />
      )}
    </svg>
  );
}