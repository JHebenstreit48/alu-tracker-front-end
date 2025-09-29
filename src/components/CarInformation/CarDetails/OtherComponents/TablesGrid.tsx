import ClassRank from "@/components/CarInformation/CarDetails/Tables/ClassRank";
import BlueprintsTable from "@/components/CarInformation/CarDetails/Tables/BlueprintsTable";
import StockStatsTable from "@/components/CarInformation/CarDetails/Tables/StarsStats/Stock";
import MaxStarTable from "@/components/CarInformation/CarDetails/Tables/StarsStats/Max";
import GoldMaxStatsTable from "@/components/CarInformation/CarDetails/Tables/StarsStats/Gold";
import KeyInfo from "@/components/CarInformation/CarDetails/Tables/KeyInfo";
import type { FullCar } from "@/components/CarInformation/CarDetails/types";

type Props = {
  car: FullCar;
  trackerMode: boolean;
  keyObtained: boolean;
  onKeyObtainedChange: (val: boolean) => void;
  unitPreference: "metric" | "imperial";
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

      <div className="carDetailTables">
        <div className="tableCard">
          <ClassRank car={car} trackerMode={trackerMode} forceOwned={car.KeyCar && keyObtained} />
        </div>

        <div className="tableCard">
          <BlueprintsTable car={car} trackerMode={trackerMode} />
        </div>

        <div className="tableCard">
          <StockStatsTable car={car} unitPreference={unitPreference} trackerMode={trackerMode} />
        </div>

        <MaxStarTable car={car} unitPreference={unitPreference} trackerMode={trackerMode} />

        <div className="tableCard">
          <GoldMaxStatsTable car={car} unitPreference={unitPreference} trackerMode={trackerMode} />
        </div>
      </div>
    </>
  );
}