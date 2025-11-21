import { useEffect, useState } from "react";
import { fetchCarDetail, fetchCarStatus } from "@/components/CarDetails/services/api";
import {
  getCarTrackingData,
  setCarTrackingData,
  generateCarKey,
} from "@/utils/shared/StorageUtils";
import type { FullCar, CarStatus } from "@/types/CarDetails";

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
        setStatus(s);

        const key = generateCarKey(detail.Brand, detail.Model);
        const stored = getCarTrackingData(key);

        // A) Seed stars for key cars in tracker mode
        if (trackerMode && detail.KeyCar && stored.stars === undefined) {
          setCarTrackingData(key, { ...stored, stars: 1 });
        }

        // B) Migrate: if owned but no keyObtained, set both
        if (detail.KeyCar) {
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