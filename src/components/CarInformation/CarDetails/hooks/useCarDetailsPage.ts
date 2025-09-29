import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import { fetchCarDetail, fetchCarStatus } from "@/components/CarInformation/CarDetails/services/api";
import {
  getCarTrackingData,
  setCarTrackingData,
  generateCarKey,
  normalizeString,
} from "@/components/CarInformation/CarDetails/Miscellaneous/StorageUtils";
import { useAutoSyncDependency } from "@/components/CarInformation/UserDataSync/hooks/useAutoSync";

import type {
  CarsLocationState,
  CarStatus,
  FullCar,
} from "@/components/CarInformation/CarDetails/types";

export function useCarDetailsPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const location = useLocation(); // narrow with our own type below

  const [car, setCar] = useState<FullCar | null>(null);
  const [status, setStatus] = useState<CarStatus | null>(null);
  const [error, setError] = useState(false);
  const [keyObtained, setKeyObtained] = useState(false);
  const [trackerMode, setTrackerMode] = useState(false);

  // read-only; your mph/kph switch can later live here and write to localStorage
  const unitPreference = useMemo<"metric" | "imperial">(
    () => (localStorage.getItem("preferredUnit") === "imperial" ? "imperial" : "metric"),
    []
  );

  // keep tracker state sticky when navigating between list/details
  useEffect(() => {
    setTrackerMode(localStorage.getItem("trackerMode") === "true");
  }, [location]);

  useEffect(() => {
    if (!slug) return;

    const normalized = normalizeString(slug);
    if (slug !== normalized) {
      navigate(`/cars/${normalized}`, { replace: true });
      return;
    }

    (async () => {
      try {
        const detail = await fetchCarDetail(normalized);
        setCar(detail);

        const s = await fetchCarStatus(normalized);
        setStatus(s);

        const key = generateCarKey(detail.Brand, detail.Model);
        const stored = getCarTrackingData(key);

        // Seed stars for key cars when user is in tracker mode
        if (trackerMode && detail.KeyCar && stored.stars === undefined) {
          setCarTrackingData(key, { ...stored, stars: 1 });
        }
        if (stored?.keyObtained !== undefined) setKeyObtained(stored.keyObtained);

        setError(false);
      } catch (e) {
        console.error("❌ Failed to fetch car detail:", e);
        setError(true);
      }
    })();
  }, [slug, trackerMode, navigate]);

  // server sync whenever these change
  useAutoSyncDependency([car, keyObtained, trackerMode]);

  const goBack = () => {
    const state = (location.state as CarsLocationState) ?? null;
    const lastSelectedClass = state?.selectedClass;
    const nextState: CarsLocationState = trackerMode
      ? { trackerMode: true, selectedClass: lastSelectedClass }
      : { selectedClass: lastSelectedClass };

    navigate(lastSelectedClass ? `/cars?class=${lastSelectedClass}` : "/cars", {
      state: nextState,
    });
  };

  return {
    slug,
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