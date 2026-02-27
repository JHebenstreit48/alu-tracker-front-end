import { useMemo } from "react";
import type { Car } from "@/types/shared/car";
import type { CarTracking } from "@/types/shared/tracking";
import type { StarRankOwnershipDatum } from "@/types/Tracking/starRankStats";

type StarRank = 3 | 4 | 5 | 6;

function isOwned(t?: any): boolean {
  if (!t) return false;
  return Boolean(t.owned ?? t.isOwned ?? t.hasCar ?? t.hasOwned);
}

/**
 * Ownership by MAX star rank (3★, 4★, 5★, 6★)
 * - Buckets by car.stars from allCars (source of truth)
 * - Ownership comes from tracking, joined by normalizedKey (fallback id)
 */
export function useStarRankOwnershipStats(
  allCars: Car[],
  enrichedTrackedCars: (Car & CarTracking)[]
): StarRankOwnershipDatum[] {
  return useMemo(() => {
    const ranks: StarRank[] = [3, 4, 5, 6];

    // Build tracking lookup by normalizedKey (stable) + fallback by id
    const trackingByKey = new Map<string, CarTracking>();
    const trackingById = new Map<number, CarTracking>();

    for (const t of enrichedTrackedCars) {
      if (typeof t.normalizedKey === "string" && t.normalizedKey.length > 0) {
        trackingByKey.set(t.normalizedKey, t);
      }
      if (typeof t.id === "number") {
        trackingById.set(t.id, t);
      }
    }

    const getTracking = (car: Car): CarTracking | undefined => {
      if (car.normalizedKey && trackingByKey.has(car.normalizedKey)) {
        return trackingByKey.get(car.normalizedKey);
      }
      return trackingById.get(car.id);
    };

    return ranks.map((rank) => {
      const carsOfRank = allCars.filter((c) => c.stars === rank);
      const totalOfThisRank = carsOfRank.length;

      const ownedOfThisRank = carsOfRank.filter((c) => isOwned(getTracking(c))).length;
      const unowned = Math.max(totalOfThisRank - ownedOfThisRank, 0);

      return {
        starRank: rank,
        owned: ownedOfThisRank,
        unowned,
      };
    });
  }, [allCars, enrichedTrackedCars]);
}