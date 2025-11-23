import type { Car } from '@/types/shared/car';
import type { CarTracking } from '@/types/shared/tracking';
import StarRankCircles from '@/components/Tracking/Cars/ProgressCircles/CarTotalStars/Layout/StarRankCircles';
import MaxStarRank from '@/components/Tracking/Cars/MaxStarRank/Layout/MaxStarRank';
import StarRankOwnershipChart from '@/components/Tracking/Cars/Charts/StarRankOwnershipChart';
import { useStarRankOwnershipStats } from '@/hooks/Tracking/useStarRankOwnershipStats';

type StarRank = 1 | 2 | 3 | 4 | 5 | 6;

interface Props {
  allCars: Car[];
  totalCars: number;
  ownedCount: number;
  starCounts: Record<StarRank, number>;
  enrichedTrackedCars: (Car & CarTracking)[];
}

export default function StarProgress({
  allCars,
  totalCars,
  ownedCount,
  starCounts,
  enrichedTrackedCars,
}: Props) {
  const barData = useStarRankOwnershipStats(allCars);

  return (
    <>
      <hr className="sectionRule" />
      <h2 className="starProgressTitle">Star Rank Progress</h2>
      <hr className="sectionRule" />

      <div className="circleAndTableRow">
        <div className="circleColumn">
          <StarRankCircles starCounts={starCounts} totalOwned={ownedCount} />
        </div>

        <div className="tableColumn">
          <MaxStarRank
            allCars={allCars}
            trackedCars={enrichedTrackedCars}
            totalCars={totalCars}
          />
        </div>

        <div className="chartColumn">
          <StarRankOwnershipChart data={barData} />
        </div>
      </div>
    </>
  );
}