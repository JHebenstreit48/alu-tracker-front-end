import StatBlockFields from '@/components/CarDataForm/Stats/shared/StatBlockFields';
import type { CarSeedFields } from '@/hooks/CarDataSubmission/useCarSeedFields/useCarSeedFields';

type Props = {
  activeKey: string;
  getStock: CarSeedFields['getStock'];
  updateStock: CarSeedFields['updateStock'];
  seedStock: CarSeedFields['seedStock'];
  correcting: boolean;
};

export default function Stock({ activeKey, getStock, updateStock, seedStock, correcting }: Props): JSX.Element {
  return (
    <section className="StatsBlock">
      <h3 className="StatsBlockTitle">Stock</h3>
      <StatBlockFields
        block={getStock(activeKey)}
        onFieldChange={updateStock}
        readOnly={!correcting && !!seedStock && !Object.values(seedStock).every((v) => v === 0)}
        seedValues={seedStock}
      />
    </section>
  );
}