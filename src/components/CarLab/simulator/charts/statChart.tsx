import { useMemo } from 'react';
import type { StatKey } from '@/types/CarLab/carLab';
import type { SimulatedState } from '@/types/CarLab/simulator';
import SimSvg from '@/components/CarLab/simulator/charts/simSvg';
import { layoutSimStat } from '@/utils/carLab/simLayout';
import { STAT_LABELS, formatStat } from '@/utils/carLab/values';

interface Props {
  statKey: StatKey;
  state: SimulatedState;
  selected: number;
}

export default function StatChart({ statKey, state, selected }: Props) {
  const layout = useMemo(
    () => layoutSimStat(state, statKey, selected),
    [state, statKey, selected]
  );
  const value = layout ? layout.value : null;

  return (
    <section className="carLabPanel">
      <h4 className="carLabSimTitle">{STAT_LABELS[statKey]}</h4>
      <p className="carLabSimValue">
        {value === null ? 'No data yet' : formatStat(statKey, value)}
        {value !== null && layout && !layout.exact && (
          <span className="carLabBadge"> estimated</span>
        )}
      </p>
      {layout ? (
        <div className="carLabSimChart">
          <SimSvg layout={layout} label={`${STAT_LABELS[statKey]} by upgrade step`} />
        </div>
      ) : (
        <p className="carLabEmpty">Not enough data to draw this chart.</p>
      )}
    </section>
  );
}