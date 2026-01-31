import MaxStarTables from '@/components/Tracking/Cars/MaxStarRank/UI/MaxStarTables';
import { Car } from '@/types/shared/car';
import { CarTracking } from '@/types/shared/tracking';

interface Props {
  allCars: Car[];
  trackedCars: (Car & CarTracking)[];
  totalCars: number;
}

export default function MaxStarRank({ allCars, trackedCars, totalCars }: Props) {
  return (
    <div className="maxStarSection">
      <h3 className="maxStarGridTitle">Star Tier Progress</h3>

      <div className="maxStarGridWrapper">
        <div className="maxStarGrid">
          {[3, 4, 5, 6].map((rank) => {
            const totalOfThisRank = allCars.filter((car) => car.Stars === rank);
            const trackedOfThisRank = trackedCars.filter((car) => car.Stars === rank);
            const owned = trackedOfThisRank.filter((car) => car.owned).length;
            const maxed = trackedOfThisRank.filter((car) => car.owned && car.stars === rank).length;

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
    </div>
  );
}