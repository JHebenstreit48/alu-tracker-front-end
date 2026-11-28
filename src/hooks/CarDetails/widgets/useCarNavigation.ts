import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { normalizeString } from "@/utils/shared/StorageUtils";
import { getLocalFilteredCars } from "@/context/Cars/filteredCarsContext";
import type { CarsLocationState } from "@/types/shared/car";

export function useCarNavigation(slug: string | undefined) {
  const navigate = useNavigate();
  const location = useLocation();
  const [trackerMode, setTrackerMode] = useState(false);

  const filteredCars = useMemo(() => getLocalFilteredCars(), [slug]);

  const unitPreference = useMemo<"metric" | "imperial">(
    () => (localStorage.getItem("preferredUnit") === "imperial" ? "imperial" : "metric"),
    []
  );

  useEffect(() => {
    setTrackerMode(localStorage.getItem("trackerMode") === "true");
  }, [location]);

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

  const { prevSlug, nextSlug } = useMemo(() => {
    if (!slug || filteredCars.length <= 1) return { prevSlug: null, nextSlug: null };

    const index = filteredCars.findIndex(
      (car) => (car.normalizedKey ?? normalizeString(`${car.brand}-${car.model}`)) === slug
    );

    if (index === -1) return { prevSlug: null, nextSlug: null };

    const prevCar = filteredCars[index - 1] ?? null;
    const nextCar = filteredCars[index + 1] ?? null;

    return {
      prevSlug: prevCar
        ? (prevCar.normalizedKey ?? normalizeString(`${prevCar.brand}-${prevCar.model}`))
        : null,
      nextSlug: nextCar
        ? (nextCar.normalizedKey ?? normalizeString(`${nextCar.brand}-${nextCar.model}`))
        : null,
    };
  }, [slug, filteredCars]);

  const goToCar = (targetSlug: string) => {
    navigate(`/cars/${targetSlug}`, { state: location.state });
  };

  return { trackerMode, unitPreference, goBack, prevSlug, nextSlug, goToCar };
}