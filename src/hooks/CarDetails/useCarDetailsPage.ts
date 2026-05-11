import { useEffect } from "react";
import { useCarData } from "./useCarData";
import { useCarNavigation } from "./useCarNavigation";
import { useAutoSyncDependency } from "@/hooks/UserDataSync/useAutoSync";
import {
  generateCarKey,
  getCarTrackingData,
} from "@/utils/shared/StorageUtils";
import { useKeyCarSeeding } from "@/hooks/CarDetails/useKeyCarSeeding";

export function useCarDetailsPage(slug: string | undefined) {
  const { trackerMode, unitPreference, goBack, prevSlug, nextSlug, goToCar } = useCarNavigation(slug);
  const { car, status, error, keyObtained, setKeyObtained } = useCarData(slug, trackerMode);

  useKeyCarSeeding(car, trackerMode);

  useEffect(() => {
    if (!car || !trackerMode || !car.keyCar) return;
    const k = generateCarKey(car.brand, car.model);
    const stored = getCarTrackingData(k);
    const storedKey = !!stored.keyObtained;
    if (storedKey !== !!keyObtained) setKeyObtained(storedKey);
  }, [car, trackerMode, keyObtained, setKeyObtained]);

  useAutoSyncDependency([car, keyObtained, trackerMode]);

  return {
    car,
    status,
    error,
    keyObtained,
    setKeyObtained,
    trackerMode,
    unitPreference,
    goBack,
    prevSlug,
    nextSlug,
    goToCar,
  };
}