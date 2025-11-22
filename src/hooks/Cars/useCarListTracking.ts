import { useEffect, useState, useMemo } from "react";
import { getAllCarTrackingData } from "@/utils/shared/StorageUtils";
import type { CarTrackingMap } from "@/types/shared/tracking";

export function useCarListTracking() {
  const [trackingMap, setTrackingMap] = useState<CarTrackingMap>({});

  useEffect(() => {
    try {
      const all = getAllCarTrackingData();
      setTrackingMap(all);
    } catch (err) {
      console.error("Failed to load car tracking data:", err);
      setTrackingMap({});
    }
  }, []);

  const trackingEnabled = useMemo(
    () => Object.keys(trackingMap).length > 0,
    [trackingMap]
  );

  const getTrackingForKey = (carKey: string) => trackingMap[carKey];

  return { trackingEnabled, getTrackingForKey, trackingMap };
}