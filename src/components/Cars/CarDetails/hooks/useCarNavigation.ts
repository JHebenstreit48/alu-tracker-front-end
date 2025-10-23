import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { normalizeString } from "@/components/Cars/CarDetails/Miscellaneous/StorageUtils";
import type { CarsLocationState } from "@/components/Cars/CarDetails/types";

export function useCarNavigation(slug: string | undefined) {
  const navigate = useNavigate();
  const location = useLocation();
  const [trackerMode, setTrackerMode] = useState(false);

  const unitPreference = useMemo<"metric" | "imperial">(
    () => (localStorage.getItem("preferredUnit") === "imperial" ? "imperial" : "metric"),
    []
  );

  useEffect(() => {
    setTrackerMode(localStorage.getItem("trackerMode") === "true");
  }, [location]);

  // normalize slug
  useEffect(() => {
    if (!slug) return;
    const normalized = normalizeString(slug);
    if (slug !== normalized) {
      navigate(`/cars/${normalized}`, { replace: true });
    }
  }, [slug, navigate]);

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

  return { trackerMode, unitPreference, goBack };
}