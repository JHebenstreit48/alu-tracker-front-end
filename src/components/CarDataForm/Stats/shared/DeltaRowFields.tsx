import Field from '@/components/CarDataForm/Stats/shared/Field';
import RarityBadge from '@/components/CarDataForm/Stats/shared/RarityBadge';
import type { DeltaRowState } from '@/types/CarDataSubmission/tabs/deltas';
import type { ImportRarity } from '@/types/CarDataSubmission/tabs/imports';

type Props = {
  row: DeltaRowState;
  onChange: (field: keyof DeltaRowState, value: string) => void;
  readOnly?: boolean;
  stageLabel?: string;
  rarity?: string;
};

export default function DeltaRowFields({ row, onChange, readOnly = false, stageLabel, rarity }: Props) {
  return (
    <div className="DeltaRow">
      <div className="DeltaRow__label">
        <span className="DeltaRow__stageNum">{stageLabel ?? `Stage ${row.stage}`}</span>
        {rarity && <RarityBadge rarity={rarity as ImportRarity} />}
      </div>
      <div className="DeltaRow__section">
        <div className="DeltaRow__sectionTitle">Cards Applied per Stat</div>
        <div className="StatsGrid">
          <Field label="Top Speed"    v={row.cardsTopSpeed} s={(v) => onChange('cardsTopSpeed', v)} readOnly={readOnly} />
          <Field label="Acceleration" v={row.cardsAccel}    s={(v) => onChange('cardsAccel', v)}    readOnly={readOnly} />
          <Field label="Handling"     v={row.cardsHandling} s={(v) => onChange('cardsHandling', v)} readOnly={readOnly} />
          <Field label="Nitro"        v={row.cardsNitro}    s={(v) => onChange('cardsNitro', v)}    readOnly={readOnly} />
        </div>
      </div>
      <div className="DeltaRow__section">
        <div className="DeltaRow__sectionTitle">Stat Delta per Stat</div>
        <div className="StatsGrid">
          <Field label="Top Speed"    v={row.deltaTopSpeed} s={(v) => onChange('deltaTopSpeed', v)} readOnly={readOnly} />
          <Field label="Acceleration" v={row.deltaAccel}    s={(v) => onChange('deltaAccel', v)}    readOnly={readOnly} />
          <Field label="Handling"     v={row.deltaHandling} s={(v) => onChange('deltaHandling', v)} readOnly={readOnly} />
          <Field label="Nitro"        v={row.deltaNitro}    s={(v) => onChange('deltaNitro', v)}    readOnly={readOnly} />
        </div>
      </div>
    </div>
  );
}