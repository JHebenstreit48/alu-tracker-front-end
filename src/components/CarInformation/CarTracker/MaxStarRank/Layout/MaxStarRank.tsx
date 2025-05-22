import MaxStarTables from "@/components/CarInformation/CarTracker/MaxStarRank/UI/MaxStarTables";
import { Car } from "@/components/CarInformation/CarDetails/Miscellaneous/Interfaces";
import { CarTrackingData } from "@/components/CarInformation/CarDetails/Miscellaneous/StorageUtils";

interface Props {
  trackedCars: (Car & CarTrackingData)[];
  ownedCars: (Car & CarTrackingData)[];
  totalCars: number;
}

export default function MaxStarRank({ trackedCars, ownedCars, totalCars }: Props) {
  return (
    <div className="maxStarGridWrapper">
      <div className="maxStarGrid">
        {[3, 4, 5, 6].map((rank) => {
          const carsWithThisMax = trackedCars.filter((car) => car.Stars === rank);
          const ownedWithThisMax = ownedCars.filter((car) => car.Stars === rank);

          const owned = ownedWithThisMax.length;
          const maxed = ownedWithThisMax.filter((car) => car.stars === rank).length;
          const inProgress = owned - maxed;

          return (
            <MaxStarTables
              key={rank}
              rank={rank as 3 | 4 | 5 | 6}
              owned={owned}
              inProgress={inProgress}
              maxed={maxed}
              totalInGame={carsWithThisMax.length}
              percentMaxed={owned > 0 ? (maxed / owned) * 100 : 0}
            />
          );
        })}
        {/* ✅ Show total in-game count just to use the `totalCars` value */}
        <p className="totalCarNotice">Total Cars in Game: {totalCars}</p>
      </div>
    </div>
  );
}
