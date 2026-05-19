import EmptyState from '@/components/CarDataForm/Stats/shared/EmptyState';
import Field from '@/components/CarDataForm/Stats/shared/Field';
import type { CarSeedFields } from '@/hooks/CarDataSubmission/useCarSeedFields/useCarSeedFields';
import { STAR_KEYS, STAR_LABELS } from '@/types/CarDataSubmission/tabs/shared';

type Props = {
  fields: CarSeedFields;
  noCarsSelected: boolean;
  carSelector: React.ReactNode;
};

export default function MaxStars({ fields, noCarsSelected, carSelector }: Props) {
  if (noCarsSelected) return <EmptyState message="Select one or more cars to enter max star stats." />;

  const {
    activeKey, activeStars,
    getMax, updateMax,
    seedMaxStar,
    isCorrectionMode, toggleCorrectionMode,
  } = fields;

  const correcting = isCorrectionMode(activeKey, 'maxStars');

  return (
    <>
      {carSelector}
      <div className="StatsTabHeader">
        <label className="CorrectionToggle">
          <input type="checkbox" checked={correcting} onChange={() => toggleCorrectionMode('maxStars')} />
          <span>Submit correction</span>
        </label>
      </div>
      <div className={`StatsBlocks${activeStars % 2 !== 0 ? ' StatsBlocks--odd' : ''}`}>
        {getMax(activeKey).slice(0, activeStars).map((block, i) => {
          const seedStar = seedMaxStar?.[STAR_KEYS[i]] ?? null;
          const hasRealData = seedStar && !Object.values(seedStar).every((v) => v === 0);
          return (
            <section key={STAR_KEYS[i]} className="StatsBlock">
              <h3 className="StatsBlockTitle">
                Max {STAR_LABELS[i]}{i + 1 === activeStars ? ' (Gold Max)' : ''}
              </h3>
              <div className="StatsGrid StatsGrid--nitroCenter">
                <Field label="Rank"         v={block.rank}     s={(v) => updateMax(i, 'rank', v)}     readOnly={!correcting && !!hasRealData} placeholder={seedStar?.rank ? String(seedStar.rank) : '—'} />
                <Field label="Top Speed"    v={block.topSpeed}  s={(v) => updateMax(i, 'topSpeed', v)}  readOnly={!correcting && !!hasRealData} placeholder={seedStar?.topSpeed ? String(seedStar.topSpeed) : '—'} />
                <Field label="Acceleration" v={block.accel}     s={(v) => updateMax(i, 'accel', v)}     readOnly={!correcting && !!hasRealData} placeholder={seedStar?.acceleration ? String(seedStar.acceleration) : '—'} />
                <Field label="Handling"     v={block.handling}  s={(v) => updateMax(i, 'handling', v)}  readOnly={!correcting && !!hasRealData} placeholder={seedStar?.handling ? String(seedStar.handling) : '—'} />
                <div className="StatsNitro">
                  <Field label="Nitro" v={block.nitro} s={(v) => updateMax(i, 'nitro', v)} readOnly={!correcting && !!hasRealData} placeholder={seedStar?.nitro ? String(seedStar.nitro) : '—'} />
                </div>
              </div>
            </section>
          );
        })}
      </div>
    </>
  );
}