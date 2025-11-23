import { useCallback, useEffect, useState } from 'react';
import type { Car } from '@/types/shared/car';
import type { CarTracking } from '@/types/shared/tracking';
import { getAllCarTrackingData, generateCarKey } from '@/utils/shared/StorageUtils';
import { carsAdapter } from '@/lib/Firebase/carsAdapter';

export interface TrackedCar extends CarTracking {
  carId: string;
}

export interface KeyCarSummary {
  total: number;
  obtained: number;
  owned: number;
}

type StarRank = 1 | 2 | 3 | 4 | 5 | 6;

export interface CarTrackerState {
  allCars: Car[];
  totalCars: number;
  trackedCars: TrackedCar[];
  keySummary: KeyCarSummary;
  starCounts: Record<StarRank, number>;
  enrichedTrackedCars: (Car & CarTracking)[];
}

const initialStarCounts: Record<StarRank, number> = {
  1: 0,
  2: 0,
  3: 0,
  4: 0,
  5: 0,
  6: 0,
};

export function useCarTrackerData(): CarTrackerState {
  const [state, setState] = useState<CarTrackerState>({
    allCars: [],
    totalCars: 0,
    trackedCars: [],
    keySummary: { total: 0, obtained: 0, owned: 0 },
    starCounts: initialStarCounts,
    enrichedTrackedCars: [],
  });

  const recomputeFromLocal = useCallback((carsList: Car[] = state.allCars) => {
    const allTracked = getAllCarTrackingData();

    const trackedCars: TrackedCar[] = Object.entries(allTracked).map(
      ([carId, data]) => ({ carId, ...data })
    );

    const keyCars = carsList.filter((car) => car.KeyCar);
    const keyCarKeys = keyCars.map((car) =>
      generateCarKey(car.Brand, car.Model)
    );

    const allTrackedEntries = Object.entries(allTracked);

    const keysObtained = allTrackedEntries
      .filter(([, val]) => val.keyObtained)
      .map(([key]) => key)
      .filter((k) => keyCarKeys.includes(k));

    const ownedKeyCars = allTrackedEntries
      .filter(([, val]) => val.owned)
      .map(([key]) => key)
      .filter((k) => keyCarKeys.includes(k));

    const ownedCars = trackedCars.filter((car) => car.owned);
    const starCounts: Record<StarRank, number> = { ...initialStarCounts };

    ownedCars.forEach((car) => {
      const stars = car.stars ?? 0;
      if (stars >= 1 && stars <= 6) {
        starCounts[stars as StarRank]++;
      }
    });

    const enrichedTrackedCars: (Car & CarTracking)[] = carsList
      .map((car) => {
        const key = generateCarKey(car.Brand, car.Model);
        const trackingData = allTracked[key];
        return trackingData ? { ...car, ...trackingData } : null;
      })
      .filter((c): c is Car & CarTracking => c !== null);

    setState((prev) => ({
      ...prev,
      trackedCars,
      keySummary: {
        total: keyCarKeys.length,
        obtained: keysObtained.length,
        owned: ownedKeyCars.length,
      },
      starCounts,
      enrichedTrackedCars,
    }));
  }, [state.allCars]);

  useEffect(() => {
    recomputeFromLocal();
    const onSynced = () => recomputeFromLocal();
    window.addEventListener('user-progress-synced', onSynced);
    return () => window.removeEventListener('user-progress-synced', onSynced);
  }, [recomputeFromLocal]);

  useEffect(() => {
    carsAdapter
      .list()
      .then((cars: unknown) => {
        const arr = Array.isArray(cars) ? (cars as Car[]) : [];
        setState((prev) => ({
          ...prev,
          allCars: arr,
          totalCars: arr.length || 0,
        }));
        recomputeFromLocal(arr);
      })
      .catch((err) => {
        console.error('Failed to fetch car list for tracker:', err);
      });
  }, [recomputeFromLocal]);

  return state;
}