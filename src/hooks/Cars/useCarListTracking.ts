import { useEffect, useMemo, useState } from "react";
import { getAllCarTrackingData } from "@/utils/shared/StorageUtils";
import type { CarTrackingMap } from "@/types/shared/tracking";

export function useCarListTracking() {
  const [trackingMap, setTrackingMap] = useState<CarTrackingMap>({});

  useEffect(() => {
    const read = () => {
      try {
        const all = getAllCarTrackingData();
        setTrackingMap(all);
      } catch (err) {
        console.error("Failed to load car tracking data:", err);
        setTrackingMap({});
      }
    };

    // Initial load
    read();

    // React to changes from other tabs / parts of the app
    window.addEventListener("storage", read);
    window.addEventListener("tracking:updated", read);

    return () => {
      window.removeEventListener("storage", read);
      window.removeEventListener("tracking:updated", read);
    };
  }, []);

  const trackingEnabled = useMemo(
    () => Object.keys(trackingMap).length > 0,
    [trackingMap]
  );

  const getTrackingForKey = (carKey: string) => trackingMap[carKey];

  return {
    trackingEnabled,
    getTrackingForKey,
    trackingMap,
  };
}