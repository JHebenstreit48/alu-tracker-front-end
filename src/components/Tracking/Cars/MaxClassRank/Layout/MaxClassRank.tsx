import MaxClassTables from "@/components/Tracking/Cars/MaxClassRank/UI/MaxClassTables";
import { Car } from "@/types/shared/car";
import { CarTracking } from "@/types/shared/tracking";

interface Props {
  allCars: Car[];
  trackedCars: (Car & CarTracking)[];
}

const CLASSES = ["D", "C", "B", "A", "S"] as const;
type CarClass = (typeof CLASSES)[number];

export default function MaxClassRank({ allCars, trackedCars }: Props) {
  return (
    <div className="maxClassSection">
      <h3 className="maxClassGridTitle">Class Tier Progress</h3>

      <div className="maxClassGridWrapper">
        <div className="maxClassGrid">
          {CLASSES.map((carClass) => {
            const totalOfThisClass = allCars.filter((car) => car.class === carClass);
            const trackedOfThisClass = trackedCars.filter((car) => car.class === carClass);

            const owned = trackedOfThisClass.filter((car) => car.owned).length;

            // ✅ "Maxed" means reached their max star count (not gold maxed)
            const maxed = trackedOfThisClass.filter(
              (car) => car.owned && car.stars === car.stars
            ).length;

            const inProgress = owned - maxed;

            return (
              <MaxClassTables
                key={carClass}
                carClass={carClass as CarClass}
                owned={owned}
                inProgress={inProgress}
                maxed={maxed}
                totalInGame={totalOfThisClass.length}
                percentMaxed={owned > 0 ? (maxed / owned) * 100 : 0}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}