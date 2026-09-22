import BasicInfo from '@/components/CarDetails/Tables/BasicInfo';
import BlueprintsTable from '@/components/CarDetails/Tables/Blueprints/BlueprintsTable';
import ObtainableVia from '@/components/CarDetails/Tables/ObtainableVia';
import KeyInfo from '@/components/CarDetails/Tables/KeyInfo';
import StatsTables from '@/components/CarDetails/Tables/StarsStats/StatsTables';

import type { FullCar } from '@/types/shared/car';

type Props = {
  car: FullCar;
  trackerMode: boolean;
  keyObtained: boolean;
  onKeyObtainedChange: (val: boolean) => void;
  unitPreference: 'metric' | 'imperial';
};

export default function TablesGrid({
  car,
  trackerMode,
  keyObtained,
  onKeyObtainedChange,
  unitPreference,
}: Props) {
  return (
    <>
      <KeyInfo
        car={car}
        trackerMode={trackerMode}
        keyObtained={keyObtained}
        onKeyObtainedChange={onKeyObtainedChange}
      />

      {/* [ Class info ] [ Blueprints ] / [ Obtainable Via (spans both) ] */}
      <div className="carDetailsTables">
        <div className="tableCard">
          <BasicInfo
            car={car}
            trackerMode={trackerMode}
            forceOwned={car.keyCar && keyObtained}
          />
        </div>

        <div className="tableCard">
          <BlueprintsTable
            car={car}
            trackerMode={trackerMode}
          />
        </div>

        <div className="tableCard obtainableCard">
          <ObtainableVia obtainableVia={car.obtainableVia} />
        </div>
      </div>

      {/* Stats only */}
      <div className="statsGrid">
        <StatsTables
          car={car}
          unitPreference={unitPreference}
        />
      </div>
    </>
  );
}