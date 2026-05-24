import EmptyState from '@/components/CarDataForm/Stats/shared/EmptyState';
import Field from '@/components/CarDataForm/Stats/shared/Field';
import type { CarSeedFields } from '@/hooks/CarDataSubmission/useCarSeedFields/useCarSeedFields';

type Props = {
  fields: CarSeedFields;
  noCarsSelected: boolean;
  carSelector: React.ReactNode;
  perCarNote: React.ReactNode;
};

export default function UpgradeCost({ fields, noCarsSelected, carSelector, perCarNote }: Props) {
  if (noCarsSelected) return <EmptyState message="Select a car to enter upgrade costs." />;

  const {
    activeKey, seedLoading,
    seedStageNums, getCosts, updateCost,
    seedCreditCosts,
    isCorrectionMode, toggleCorrectionMode,
  } = fields;

  const correcting = isCorrectionMode(activeKey, 'cost');
  const costs = getCosts(activeKey);

  return (
    <>
      {carSelector}{perCarNote}
      <div className="StatsTabHeader">
        {seedLoading && <p className="CarDataFormHint">Loading stage data…</p>}
        <label className="CorrectionToggle">
          <input type="checkbox" checked={correcting} onChange={() => toggleCorrectionMode('cost')} />
          <span>Submit correction</span>
        </label>
      </div>
      <div className="StatsBlocks">
        <section className="StatsBlock StatsBlock--wide">
          <h3 className="StatsBlockTitle">Credit cost per stage upgrade</h3>
          <div className="StatsGrid StatsGrid--costXp">
            {seedStageNums.map((stageNum, i) => {
              const seedVal = seedCreditCosts?.[stageNum];
              const hasReal = seedVal !== undefined && seedVal !== 0;
              const prev = seedStageNums[i - 1] ?? '0';
              return (
                <Field
                  key={stageNum}
                  label={`Stage ${prev} → ${stageNum}`}
                  v={costs[stageNum] ?? ''}
                  s={(v) => updateCost(stageNum, v)}
                  readOnly={!correcting && hasReal}
                  placeholder={hasReal ? String(seedVal) : '—'}
                />
              );
            })}
          </div>
        </section>
      </div>
    </>
  );
}