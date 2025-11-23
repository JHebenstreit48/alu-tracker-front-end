import { useMemo } from 'react';
import type { Car } from '@/types/shared/car';
import { getAllCarTrackingData, generateCarKey } from '@/utils/shared/StorageUtils';
import type { StarRankOwnershipDatum } from '@/types/Tracking/starRankStats';

export function useStarRankOwnershipStats(allCars: Car[]): StarRankOwnershipDatum[] {
  return useMemo(() => {
    // Only valid *max* ranks in the game data
    const ranks: number[] = [3, 4, 5, 6];

    const allTracked = getAllCarTrackingData();

    return ranks.map((rank) => {
      // All cars whose *max* star rank is this rank
      const carsOfThisRank = allCars.filter((c) => c.Stars === rank);

      // How many of those you actually own
      const ownedOfThisRank = carsOfThisRank.filter((car) => {
        const key = generateCarKey(car.Brand, car.Model);
        const tracking = allTracked[key] as { owned?: boolean } | undefined;
        return !!tracking?.owned;
      });

      const total = carsOfThisRank.length;
      const owned = ownedOfThisRank.length;
      const unowned = Math.max(total - owned, 0);

      const datum: StarRankOwnershipDatum = {
        starRank: rank,   // still just a number as in your existing type
        owned,
        unowned,
      };

      return datum;
    });
  }, [allCars]);
}