import { useMemo } from 'react';
import type { Car } from '@/types/shared/car';
import type { CarTracking } from '@/types/shared/tracking';

export type MaxStarRank = 3 | 4 | 5 | 6;

export interface MaxStarOwnershipDatum {
  rank: MaxStarRank;
  label: string;
  owned: number;
  unowned: number;
}

export function useMaxStarOwnershipStats(
  allCars: Car[],
  trackedCars: (Car & CarTracking)[]
): MaxStarOwnershipDatum[] {
  return useMemo(() => {
    const ranks: MaxStarRank[] = [3, 4, 5, 6];

    return ranks.map((rank) => {
      // All cars in game that max out at this star rank
      const carsOfRank = allCars.filter((c) => c.stars === rank);

      // Owned cars within that max-star bucket
      const ownedOfRank = trackedCars.filter(
        (c) => c.stars === rank && c.owned
      );

      const total = carsOfRank.length;
      const owned = ownedOfRank.length;
      const unowned = Math.max(total - owned, 0);

      return {
        rank,
        label: `${rank}★`,
        owned,
        unowned,
      };
    });
  }, [allCars, trackedCars]);
}