import { useMemo } from 'react';
import type { Car } from '@/types/shared/car';
import type { CarTracking } from '@/types/shared/tracking';
import type { StarRankOwnershipDatum } from '@/types/Tracking/starRankStats';

type StarRank = 3 | 4 | 5 | 6;

/**
 * Builds data for the "Ownership by Current Star Rank" bar chart,
 * but grouped by **max star rank** (3★, 4★, 5★, 6★) to match the four tables.
 *
 * - `owned`   = number of cars you own whose max rank is this value
 * - `unowned` = total cars of this max rank minus owned
 */
export function useStarRankOwnershipStats(
  allCars: Car[],
  enrichedTrackedCars: (Car & CarTracking)[]
): StarRankOwnershipDatum[] {
  return useMemo(() => {
    const ranks: StarRank[] = [3, 4, 5, 6];

    return ranks.map((rank) => {
      // total cars in game that max out at this rank
      const totalOfThisRank = allCars.filter((c) => c.stars === rank).length;

      // of those, how many do you own?
      const ownedOfThisRank = enrichedTrackedCars.filter(
        (c) => c.stars === rank && c.owned
      ).length;

      const unowned = Math.max(totalOfThisRank - ownedOfThisRank, 0);

      return {
        starRank: rank,
        owned: ownedOfThisRank,
        unowned,
      };
    });
  }, [allCars, enrichedTrackedCars]);
}