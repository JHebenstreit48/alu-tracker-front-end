// src/components/CarInformation/CarDetails/hooks/useKeyObtained.ts
import { useMemo } from "react";
import { generateCarKey, getCarTrackingData, setCarTrackingData } from "@/components/CarInformation/CarDetails/Miscellaneous/StorageUtils";
import type { FullCar } from "@/components/CarInformation/CarDetails/types";

export function useKeyObtained(
  car: FullCar | null,
  setKeyObtained: (v: boolean) => void
) {
  return useMemo(
    () => (obtained: boolean) => {
      if (!car) return;
      const k = generateCarKey(car.Brand, car.Model);
      const prev = getCarTrackingData(k);
      setCarTrackingData(k, { ...prev, keyObtained: obtained });
      setKeyObtained(obtained);
    },
    [car, setKeyObtained]
  );
}