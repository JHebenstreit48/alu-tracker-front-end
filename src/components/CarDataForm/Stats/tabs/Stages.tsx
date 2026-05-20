import EmptyState from '@/components/CarDataForm/Stats/shared/EmptyState';
import Field from '@/components/CarDataForm/Stats/shared/Field';
import type { CarSeedFields } from '@/hooks/CarDataSubmission/useCarSeedFields/useCarSeedFields';
import { STAR_KEYS, STAR_LABELS } from '@/types/CarDataSubmission/tabs/shared';
import { emptyStageInput } from '@/types/CarDataSubmission/tabs/stages';

type Props = {
  fields: CarSeedFields;
  noCarsSelected: boolean;
  carSelector: React.ReactNode;
  perCarNote: React.ReactNode;
};

export default function Stages({ fields, noCarsSelected, carSelector, perCarNote }: Props) {
  if (noCarsSelected) return <EmptyState message="Select a car to enter stage stats." />;

  const {
    activeKey,
    activeStars,
    seedLoading,
    getStageInputs,
    updateStageInput,
    seedStagesByStar,
    isCorrectionMode,
    toggleCorrectionMode,
  } = fields;

  const correcting = isCorrectionMode(activeKey, 'stages');
  const inputs = getStageInputs(activeKey);

  const ro = (val: number | undefined) => !correcting && !!val && val !== 0;

  return (
    <>
      {carSelector}
      {perCarNote}
      <div className="StatsTabHeader">
        {seedLoading && <p className="CarDataFormHint">Loading stage data…</p>}
        <label className="CorrectionToggle">
          <input
            type="checkbox"
            checked={correcting}
            onChange={() => toggleCorrectionMode('stages')}
          />
          <span>Submit correction</span>
        </label>
      </div>
      {STAR_KEYS.slice(0, activeStars).map((starKey, starIdx) => {
        const seedStages: any[] = seedStagesByStar?.[starKey] ?? [];
        if (!seedStages.length && !Object.keys(inputs).length) return null;
        return (
          <div
            key={starKey}
            className="StagesStarGroup"
          >
            <h3 className="StagesStarGroup__title">{STAR_LABELS[starIdx]}</h3>
            <div className="StatsBlocks">
              {seedStages.map((seedEntry: any) => {
                const stageNum = String(seedEntry.stage);
                const input = inputs[stageNum] ?? emptyStageInput(seedEntry.stage);
                return (
                  <section
                    key={stageNum}
                    className="StatsBlock"
                  >
                    <h3 className="StatsBlockTitle">Stage {seedEntry.stage}</h3>
                    <div className="StatsGrid StatsGrid--nitroCenter">
                      <Field
                        label="Rank"
                        v={input.rank}
                        s={(v) => updateStageInput(stageNum, 'rank', v)}
                        readOnly={ro(seedEntry.rank)}
                        placeholder={seedEntry.rank ? String(seedEntry.rank) : '—'}
                      />
                      <Field
                        label="Top Speed"
                        v={input.topSpeed}
                        s={(v) => updateStageInput(stageNum, 'topSpeed', v)}
                        readOnly={ro(seedEntry.topSpeed)}
                        placeholder={seedEntry.topSpeed ? String(seedEntry.topSpeed) : '—'}
                      />
                      <Field
                        label="Acceleration"
                        v={input.accel}
                        s={(v) => updateStageInput(stageNum, 'accel', v)}
                        readOnly={ro(seedEntry.acceleration)}
                        placeholder={seedEntry.acceleration ? String(seedEntry.acceleration) : '—'}
                      />
                      <Field
                        label="Handling"
                        v={input.handling}
                        s={(v) => updateStageInput(stageNum, 'handling', v)}
                        readOnly={ro(seedEntry.handling)}
                        placeholder={seedEntry.handling ? String(seedEntry.handling) : '—'}
                      />
                      <div className="StatsNitro">
                        <Field
                          label="Nitro"
                          v={input.nitro}
                          s={(v) => updateStageInput(stageNum, 'nitro', v)}
                          readOnly={ro(seedEntry.nitro)}
                          placeholder={seedEntry.nitro ? String(seedEntry.nitro) : '—'}
                        />
                      </div>
                    </div>
                  </section>
                );
              })}
            </div>
          </div>
        );
      })}
    </>
  );
}