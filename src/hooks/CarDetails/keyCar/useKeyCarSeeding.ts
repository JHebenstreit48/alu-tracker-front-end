import { useEffect } from "react";
import { generateCarKey, getCarTrackingData, setCarTrackingData } from "@/utils/shared/StorageUtils";
import type { FullCar } from "@/types/shared/car";

export function useKeyCarSeeding(car: FullCar | null, trackerMode: boolean) {
  useEffect(() => {
    if (!car || !trackerMode || !car.keyCar) return;
    const key = generateCarKey(car.brand, car.model);
    const stored = getCarTrackingData(key);
    if (stored.stars === undefined || stored.stars === null) {
      setCarTrackingData(key, { ...stored, stars: 1 });
    }
  }, [car, trackerMode]);
}