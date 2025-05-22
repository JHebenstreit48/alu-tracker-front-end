import MaxStarTables from "@/components/CarInformation/CarTracker/MaxStarRank/UI/MaxStarTables";
import { Car } from "@/components/CarInformation/CarDetails/Miscellaneous/Interfaces";
import { CarTrackingData } from "@/components/CarInformation/CarDetails/Miscellaneous/StorageUtils";

interface Props {
  allCars: Car[];
  trackedCars: (Car & CarTrackingData)[];
  totalCars: number;
}

export default function MaxStarRank({
  allCars,
  trackedCars,
  totalCars,
}: Props) {
  return (
    <div className="maxStarGridWrapper">
      <div className="maxStarGrid">
        {[3, 4, 5, 6].map((rank) => {
          // All cars in game that max out at this star rank
          const totalOfThisRank = allCars.filter((car) => car.Stars === rank);

          // Tracked cars of this rank (user has at least some data saved)
          const trackedOfThisRank = trackedCars.filter((car) => car.Stars === rank);

          // Of those tracked, how many are marked owned
          const owned = trackedOfThisRank.filter((car) => car.owned).length;

          // How many of the owned cars are at their maximum star count
          const maxed = trackedOfThisRank.filter(
            (car) => car.owned && car.stars === rank
          ).length;

          const inProgress = owned - maxed;

          return (
            <MaxStarTables
              key={rank}
              rank={rank as 3 | 4 | 5 | 6}
              owned={owned}
              inProgress={inProgress}
              maxed={maxed}
              totalInGame={totalOfThisRank.length}
              percentMaxed={owned > 0 ? (maxed / owned) * 100 : 0}
            />
          );
        })}

        <p className="totalCarNotice">Total Cars in Game: {totalCars}</p>
      </div>
    </div>
  );
}
