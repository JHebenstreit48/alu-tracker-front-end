import BlueprintsStockGold from '@/components/CarDataForm/Form/sections/blueprintsStockGold';
import type { CarSeedFields } from '@/hooks/CarDataSubmission/useCarSeedFields/useCarSeedFields';

type Props = {
  fields: CarSeedFields;
  noCarsSelected: boolean;
  carSelector: React.ReactNode;
};

export default function Overview({ fields, noCarsSelected, carSelector }: Props): JSX.Element {
  return <BlueprintsStockGold fields={fields} noCarsSelected={noCarsSelected} carSelector={carSelector} />;
}