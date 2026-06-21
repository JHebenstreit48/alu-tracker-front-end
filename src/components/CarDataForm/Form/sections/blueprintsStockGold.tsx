import EmptyState from '@/components/CarDataForm/Stats/shared/EmptyState';
import type { CarSeedFields } from '@/hooks/CarDataSubmission/useCarSeedFields/useCarSeedFields';
import {
  Blueprints,
  Stock,
  Gold,
} from '@/components/CarDataForm/Form/sections/blueprintsStockGold/index';

type Props = {
  fields: CarSeedFields;
  noCarsSelected: boolean;
  carSelector: React.ReactNode;
};

export default function BlueprintsStockGold({ fields, noCarsSelected, carSelector }: Props): JSX.Element {
  if (noCarsSelected) return <EmptyState message="Select one or more cars to enter stats." />;

  const {
    activeKey,
    activeStars,
    activeCar,
    getBps,
    getStock,
    getGold,
    updateBp,
    updateStock,
    updateGold,
    seedBlueprints,
    seedStock,
    seedGold,
    isCorrectionMode,
    toggleCorrectionMode,
  } = fields;

  const correcting = isCorrectionMode(activeKey, 'overview');
  const isKeyCar = !!activeCar?.keyCar;

  return (
    <>
      {carSelector}
      <div className="StatsTabHeader">
        <label className="CorrectionToggle">
          <input type="checkbox" checked={correcting} onChange={() => toggleCorrectionMode('overview')} />
          <span>Submit correction</span>
        </label>
      </div>
      <div className="StatsBlocks">
        <Blueprints
          activeKey={activeKey}
          activeStars={activeStars}
          getBps={getBps}
          updateBp={updateBp}
          seedBlueprints={seedBlueprints}
          isKeyCar={isKeyCar}
          correcting={correcting}
        />
        <Stock
          activeKey={activeKey}
          getStock={getStock}
          updateStock={updateStock}
          seedStock={seedStock}
          correcting={correcting}
        />
        <Gold
          activeKey={activeKey}
          getGold={getGold}
          updateGold={updateGold}
          seedGold={seedGold}
          correcting={correcting}
        />
      </div>
    </>
  );
}