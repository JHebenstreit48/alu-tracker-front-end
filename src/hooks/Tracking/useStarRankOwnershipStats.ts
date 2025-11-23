import { useMemo } from 'react';
import type { Car } from '@/types/shared/car';
import type { StarRankOwnershipDatum } from '@/types/Tracking/starRankStats';
import { getAllCarTrackingData, generateCarKey } from '@/utils/shared/StorageUtils';

const MAX_STAR_RANK = 6;

export function useStarRankOwnershipStats(allCars: Car[]): StarRankOwnershipDatum[] {
  return useMemo(() => {
    const trackingMap = getAllCarTrackingData();
    const results: StarRankOwnershipDatum[] = [];

    for (let rank = 1; rank <= MAX_STAR_RANK; rank++) {
      let totalForRank = 0;
      let ownedForRank = 0;

      for (const car of allCars) {
        if (car.Stars < rank) continue;
        totalForRank++;

        const key = generateCarKey(car.Brand, car.Model);
        const tracking = trackingMap[key];

        if (tracking?.owned && tracking.stars === rank) {
          ownedForRank++;
        }
      }

      results.push({
        starRank: rank,
        owned: ownedForRank,
        unowned: Math.max(totalForRank - ownedForRank, 0),
      });
    }

    return results;
  }, [allCars]);
}