import { useCarData } from "./useCarData";
import { useCarNavigation } from "./useCarNavigation";
import { useAutoSyncDependency } from "@/components/CarInformation/UserDataSync/hooks/useAutoSync";

export function useCarDetailsPage(slug: string | undefined) {
  const { trackerMode, unitPreference, goBack } = useCarNavigation(slug);
  const { car, status, error, keyObtained, setKeyObtained } = useCarData(slug, trackerMode);

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