// src/components/CarInformation/CarDetails/hooks/useKeyObtained.ts
import { useMemo } from "react";
import {
  generateCarKey,
  getCarTrackingData,
  setCarTrackingData,
} from "@/components/CarInformation/CarDetails/Miscellaneous/StorageUtils";
import type { FullCar } from "@/components/CarInformation/CarDetails/types";

/**
 * Returns a stable handler that:
 *  - writes keyObtained to storage
 *  - sets owned=true when obtained becomes true (so ownedCars stays in sync)
 *  - updates local state so the checkbox stays checked across navigation
 */
export function useKeyObtainedHandler(
  car: FullCar | null,
  setKeyObtained: (v: boolean) => void
) {
  return useMemo(
    () => (obtained: boolean) => {
      if (!car) return;
      const k = generateCarKey(car.Brand, car.Model);
      const prev = getCarTrackingData(k);
      const next = obtained ? { ...prev, keyObtained: true, owned: true } : { ...prev, keyObtained: false };
      setCarTrackingData(k, next);
      setKeyObtained(obtained);
    },
    [car, setKeyObtained]
  );
}