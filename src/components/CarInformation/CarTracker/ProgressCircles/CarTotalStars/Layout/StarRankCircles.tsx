import StarRankMeter from "@/components/CarInformation/CarTracker/ProgressCircles/CarTotalStars/UI/StarRankMeter";

interface StarRankCirclesProps {
  starCounts: Record<number, number>;  // {1: X, 2: Y, ..., 6: Z}
  totalOwned: number;
}

export default function StarRankCircles({ starCounts, totalOwned }: StarRankCirclesProps) {
  return (
    <div className="starRankGridWrapper">
      <div className="starRankGrid">
        {Array.from({ length: 6 }, (_, i) => {
          const rank = i + 1;
          return (
            <StarRankMeter
              key={rank}
              rank={rank}
              count={starCounts[rank] ?? 0}
              totalOwned={totalOwned}
            />
          );
        })}
      </div>
    </div>
  );
}