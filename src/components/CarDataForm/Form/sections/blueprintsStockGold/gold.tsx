import StatBlockFields from '@/components/CarDataForm/Stats/shared/StatBlockFields';
import type { CarSeedFields } from '@/hooks/CarDataSubmission/useCarSeedFields/useCarSeedFields';

type Props = {
  activeKey: string;
  getGold: CarSeedFields['getGold'];
  updateGold: CarSeedFields['updateGold'];
  seedGold: CarSeedFields['seedGold'];
  correcting: boolean;
};

export default function Gold({ activeKey, getGold, updateGold, seedGold, correcting }: Props): JSX.Element {
  return (
    <section className="StatsBlock StatsBlock--goldFull">
      <h3 className="StatsBlockTitle">Gold</h3>
      <StatBlockFields
        block={getGold(activeKey)}
        onFieldChange={updateGold}
        readOnly={!correcting && !!seedGold && !Object.values(seedGold).every((v) => v === 0)}
        seedValues={seedGold}
      />
    </section>
  );
}