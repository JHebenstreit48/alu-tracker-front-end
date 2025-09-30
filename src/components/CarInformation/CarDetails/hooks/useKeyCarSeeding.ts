// src/components/CarInformation/CarDetails/hooks/useKeyCarSeeding.ts
import { useEffect } from "react";
import { generateCarKey, getCarTrackingData, setCarTrackingData } from "@/components/CarInformation/CarDetails/Miscellaneous/StorageUtils";
import type { FullCar } from "@/components/CarInformation/CarDetails/types";

export function useKeyCarSeeding(car: FullCar | null, trackerMode: boolean) {
  useEffect(() => {
    if (!car || !trackerMode || !car.KeyCar) return;
    const key = generateCarKey(car.Brand, car.Model);
    const stored = getCarTrackingData(key);
    if (stored.stars === undefined || stored.stars === null) {
      setCarTrackingData(key, { ...stored, stars: 1 });
    }
  }, [car, trackerMode]);
}