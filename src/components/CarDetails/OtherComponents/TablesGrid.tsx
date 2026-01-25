import ClassRank from "@/components/CarDetails/Tables/ClassRank";
import BlueprintsTable from "@/components/CarDetails/Tables/BlueprintsTable";
import KeyInfo from "@/components/CarDetails/Tables/KeyInfo";
import StatsTables from "@/components/CarDetails/Tables/StarsStats/StatsTables";
import type { FullCar } from "@/types/shared/car";

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
          <ClassRank
            car={car}
            trackerMode={trackerMode}
            forceOwned={car.KeyCar && keyObtained}
          />
        </div>

        <div className="tableCard">
          <BlueprintsTable car={car} trackerMode={trackerMode} />
        </div>

        {/* Stats tables: Stock + 1★..N★ + Gold (auto-skips missing) */}
        <StatsTables car={car} unitPreference={unitPreference} />
      </div>
    </>
  );
}