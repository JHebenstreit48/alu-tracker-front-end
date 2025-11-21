import ClassRank from "@/components/CarDetails/Tables/ClassRank";
import BlueprintsTable from "@/components/CarDetails/Tables/BlueprintsTable";
import StockStatsTable from "@/components/CarDetails/Tables/StarsStats/Stock";
import MaxStarTable from "@/components/CarDetails/Tables/StarsStats/Max";
import GoldMaxStatsTable from "@/components/CarDetails/Tables/StarsStats/Gold";
import KeyInfo from "@/components/CarDetails/Tables/KeyInfo";
import type { FullCar } from "@/types/CarDetails";

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

      <div className="carDetailsTables">
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