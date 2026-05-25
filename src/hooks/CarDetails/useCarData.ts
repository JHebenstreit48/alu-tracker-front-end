import { useEffect, useState } from "react";
import { fetchCarDetail, fetchCarStatus } from "@/api/carDetails";
import { mapApiStatus } from "@/utils/CarDetails/status";
import {
  getCarTrackingData,
  setCarTrackingData,
  generateCarKey,
} from "@/utils/shared/StorageUtils";
import type { FullCar } from "@/types/shared/car";
import type { CarStatus } from "@/types/shared/status";

export function useCarData(
  slug: string | undefined,
  trackerMode: boolean
) {
  const [car, setCar] = useState<FullCar | null>(null);
  const [status, setStatus] = useState<CarStatus | null>(null);
  const [error, setError] = useState(false);
  const [keyObtained, setKeyObtained] = useState(false);

  useEffect(() => {
    if (!slug) return;

    (async () => {
      try {
        const detail = await fetchCarDetail(slug);
        setCar(detail);

        const s = await fetchCarStatus(slug);
        console.log("detail.status:", detail.status);
        console.log("fetchCarStatus result:", s);

        if (s) {
          setStatus(s);
        } else if (detail.status) {
          const fallback = mapApiStatus({
            status: String(detail.status),
            message: detail.message as string | undefined,
          });
          setStatus(fallback);
        }

        const key = generateCarKey(detail.brand, detail.model);
        const stored = getCarTrackingData(key);

        if (trackerMode && detail.keyCar && stored.stars === undefined) {
          setCarTrackingData(key, { ...stored, stars: 1 });
        }

        if (detail.keyCar) {
          if (stored?.keyObtained !== undefined) {
            setKeyObtained(stored.keyObtained);
          } else if (stored?.owned) {
            setKeyObtained(true);
            setCarTrackingData(key, { ...stored, keyObtained: true, owned: true });
          } else {
            setKeyObtained(false);
          }
        } else {
          setKeyObtained(Boolean(stored?.keyObtained));
        }

        setError(false);
      } catch (e) {
        console.error("❌ Car fetch error:", e);
        setError(true);
      }
    })();
  }, [slug, trackerMode]);

  return { car, status, error, keyObtained, setKeyObtained };
}