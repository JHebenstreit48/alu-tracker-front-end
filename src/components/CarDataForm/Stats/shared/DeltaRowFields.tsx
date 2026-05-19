import Field from '@/components/CarDataForm/Stats/shared/Field';
import type { DeltaRowState } from '@/types/CarDataSubmission/tabs/deltas';

type Props = {
  row: DeltaRowState;
  onChange: (field: keyof DeltaRowState, value: string) => void;
  readOnly?: boolean;
};

export default function DeltaRowFields({ row, onChange, readOnly = false }: Props) {
  return (
    <div className="DeltaRow">
      <div className="DeltaRow__label">Stage {row.stage}</div>
      <div className="DeltaRow__section">
        <div className="DeltaRow__sectionTitle">Rank by Stat</div>
        <div className="StatsGrid">
          <Field label="Top Speed"    v={row.rankTopSpeed} s={(v) => onChange('rankTopSpeed', v)} readOnly={readOnly} />
          <Field label="Acceleration" v={row.rankAccel}    s={(v) => onChange('rankAccel', v)}    readOnly={readOnly} />
          <Field label="Handling"     v={row.rankHandling} s={(v) => onChange('rankHandling', v)} readOnly={readOnly} />
          <Field label="Nitro"        v={row.rankNitro}    s={(v) => onChange('rankNitro', v)}    readOnly={readOnly} />
        </div>
      </div>
      <div className="DeltaRow__section">
        <div className="DeltaRow__sectionTitle">Stat by Stat</div>
        <div className="StatsGrid">
          <Field label="Top Speed"    v={row.statTopSpeed} s={(v) => onChange('statTopSpeed', v)} readOnly={readOnly} />
          <Field label="Acceleration" v={row.statAccel}    s={(v) => onChange('statAccel', v)}    readOnly={readOnly} />
          <Field label="Handling"     v={row.statHandling} s={(v) => onChange('statHandling', v)} readOnly={readOnly} />
          <Field label="Nitro"        v={row.statNitro}    s={(v) => onChange('statNitro', v)}    readOnly={readOnly} />
        </div>
      </div>
    </div>
  );
}