import { useMemo } from "react";
import {
  generateCarKey,
  getCarTrackingData,
  setCarTrackingData,
} from "@/utils/CarDetails/StorageUtils";
import type { FullCar } from "@/types/CarDetails";

type Setter = (v: boolean) => void;

/**
 * Stable handler for Key Obtained:
 * - checking => keyObtained: true, owned: true
 * - unchecking (mistake fix) => keyObtained: false, owned: false, goldMaxed: false
 * Stars are never changed here.
 */
export function useKeyObtained(car: FullCar | null, setKeyObtained: Setter) {
  return useMemo(
    () => (obtained: boolean) => {
      if (!car) return;
      const k = generateCarKey(car.Brand, car.Model);
      const prev = getCarTrackingData(k);

      const next =
        obtained
          ? { ...prev, keyObtained: true, owned: true }
          : { ...prev, keyObtained: false, owned: false, goldMaxed: false };

      setCarTrackingData(k, next);
      setKeyObtained(obtained);
    },
    [car, setKeyObtained]
  );
}

export default useKeyObtained;