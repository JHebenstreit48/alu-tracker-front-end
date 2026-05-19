import EmptyState from '@/components/CarDataForm/Stats/shared/EmptyState';
import StatBlockFields from '@/components/CarDataForm/Stats/shared/StatBlockFields';
import Field from '@/components/CarDataForm/Stats/shared/Field';
import type { CarSeedFields } from '@/hooks/CarDataSubmission/useCarSeedFields/useCarSeedFields';
import { STAR_KEYS, STAR_LABELS } from '@/types/CarDataSubmission/tabs/shared';

type Props = {
  fields: CarSeedFields;
  noCarsSelected: boolean;
  carSelector: React.ReactNode;
};

export default function Overview({ fields, noCarsSelected, carSelector }: Props) {
  if (noCarsSelected) return <EmptyState message="Select one or more cars to enter stats." />;

  const {
    activeKey, activeStars,
    getBps, getStock, getGold,
    updateBp, updateStock, updateGold,
    seedStock, seedGold,
    isCorrectionMode, toggleCorrectionMode,
  } = fields;

  const correcting = isCorrectionMode(activeKey, 'overview');

  return (
    <>
      {carSelector}
      <div className="StatsTabHeader">
        <label className="CorrectionToggle">
          <input
            type="checkbox"
            checked={correcting}
            onChange={() => toggleCorrectionMode('overview')}
          />
          <span>Submit correction</span>
        </label>
      </div>
      <div className="StatsBlocks">
        <section className="StatsBlock">
          <h3 className="StatsBlockTitle">Blueprints</h3>
          <div className="StatsGrid">
            {getBps(activeKey).slice(0, activeStars).map((v, i) => (
              <Field key={STAR_KEYS[i]} label={STAR_LABELS[i]} v={v} s={(val) => updateBp(i, val)} />
            ))}
          </div>
        </section>
        <section className="StatsBlock">
          <h3 className="StatsBlockTitle">Stock</h3>
          <StatBlockFields
            block={getStock(activeKey)}
            onFieldChange={updateStock}
            readOnly={!correcting && !!seedStock && !Object.values(seedStock).every((v) => v === 0)}
            seedValues={seedStock}
          />
        </section>
        <section className="StatsBlock StatsBlock--goldFull">
          <h3 className="StatsBlockTitle">Gold</h3>
          <StatBlockFields
            block={getGold(activeKey)}
            onFieldChange={updateGold}
            readOnly={!correcting && !!seedGold && !Object.values(seedGold).every((v) => v === 0)}
            seedValues={seedGold}
          />
        </section>
      </div>
    </>
  );
}