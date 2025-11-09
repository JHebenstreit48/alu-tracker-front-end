import { useEffect } from "react";
import { useCarData } from "./useCarData";
import { useCarNavigation } from "./useCarNavigation";
import { useAutoSyncDependency } from "@/hooks/UserDataSync/useAutoSync";
import {
  generateCarKey,
  getCarTrackingData,
} from "@/utils/shared/StorageUtils";

// 👇 ADD THIS
import { useKeyCarSeeding } from "@/hooks/CarDetails/useKeyCarSeeding";

export function useCarDetailsPage(slug: string | undefined) {
  const { trackerMode, unitPreference, goBack } = useCarNavigation(slug);
  const { car, status, error, keyObtained, setKeyObtained } = useCarData(slug, trackerMode);

  // 🔑 Run the one-time seeding (writes stars: 1 to localStorage if missing)
  useKeyCarSeeding(car, trackerMode);

  // Keep UI ↔ storage aligned for keyObtained at load
  useEffect(() => {
    if (!car || !trackerMode || !car.KeyCar) return;
    const k = generateCarKey(car.Brand, car.Model);
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
  };
}