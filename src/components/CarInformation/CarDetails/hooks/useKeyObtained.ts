// src/components/CarInformation/CarDetails/hooks/useKeyObtained.ts
import { useMemo } from "react";
import {
  generateCarKey,
  getCarTrackingData,
  setCarTrackingData,
} from "@/components/CarInformation/CarDetails/Miscellaneous/StorageUtils";
import type { FullCar } from "@/components/CarInformation/CarDetails/types";

type Setter = (v: boolean) => void;

/**
 * Returns a stable handler that persists `keyObtained`
 * (and marks `owned` true when obtained).
 */
export function useKeyObtained(car: FullCar | null, setKeyObtained: Setter) {
  return useMemo(
    () => (obtained: boolean) => {
      if (!car) return;
      const k = generateCarKey(car.Brand, car.Model);
      const prev = getCarTrackingData(k);
      const next = {
        ...prev,
        keyObtained: obtained,
        owned: obtained ? true : prev?.owned ?? false,
      };
      setCarTrackingData(k, next);
      setKeyObtained(obtained);
    },
    [car, setKeyObtained]
  );
}

export default useKeyObtained;