import type { SimulatedState } from '@/types/CarLab/simulator';
import StatChart from '@/components/CarLab/simulator/charts/statChart';
import { STAT_KEYS } from '@/utils/carLab/values';

interface Props {
  state: SimulatedState;
  selected: number;
}

export default function StatChartGrid({ state, selected }: Props) {
  return (
    <div className="carLabSimCharts">
      {STAT_KEYS.map((key) => (
        <StatChart key={key} statKey={key} state={state} selected={selected} />
      ))}
    </div>
  );
}