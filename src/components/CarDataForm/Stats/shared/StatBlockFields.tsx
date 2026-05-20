import Field from '@/components/CarDataForm/Stats/shared/Field';
import type { StatBlockState } from '@/types/CarDataSubmission/tabs/shared';

type Props = {
  block: StatBlockState;
  onFieldChange: (field: keyof StatBlockState, value: string) => void;
  readOnly?: boolean;
  seedValues?: Record<string, number> | null;
};

export default function StatBlockFields({ block, onFieldChange, readOnly = false, seedValues }: Props) {
  const ph = (key: string) => {
    const v = seedValues?.[key];
    return v !== undefined && v !== 0 ? String(v) : '—';
  };

  return (
    <div className="StatsGrid StatsGrid--nitroCenter">
      <Field label="Rank"         v={block.rank}     s={(v) => onFieldChange('rank', v)}     readOnly={readOnly} placeholder={ph('rank')} />
      <Field label="Top Speed"    v={block.topSpeed}  s={(v) => onFieldChange('topSpeed', v)}  readOnly={readOnly} placeholder={ph('topSpeed')} />
      <Field label="Acceleration" v={block.accel}     s={(v) => onFieldChange('accel', v)}     readOnly={readOnly} placeholder={ph('acceleration')} />
      <Field label="Handling"     v={block.handling}  s={(v) => onFieldChange('handling', v)}  readOnly={readOnly} placeholder={ph('handling')} />
      <div className="StatsNitro">
        <Field label="Nitro" v={block.nitro} s={(v) => onFieldChange('nitro', v)} readOnly={readOnly} placeholder={ph('nitro')} />
      </div>
    </div>
  );
}