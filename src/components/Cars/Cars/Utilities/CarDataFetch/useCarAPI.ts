import { useState, useCallback, useEffect } from "react";
import { Car } from "@/components/Cars/Cars/CarFilters/types/CarTypes";

const API_BASE_URL =
  import.meta.env.VITE_CARS_API_BASE_URL ?? "https://alutracker-api.onrender.com";

const IMG_CDN_BASE =
  import.meta.env.VITE_IMG_CDN_BASE ?? "https://alu-tracker-image-vault.onrender.com";

const absolutize = (p?: string): string | undefined => {
  if (!p) return p;
  if (/^https?:\/\//i.test(p)) return p; // already absolute
  return `${IMG_CDN_BASE}${p.startsWith("/") ? "" : "/"}${p}`;
};

type CarsResponse = {
  cars?: Car[];
  [k: string]: unknown;
};

export function useCarAPI(selectedClass: string) {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadCars = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        limit: "1000",
        offset: "0",
        ...(selectedClass !== "All Classes" && { class: selectedClass }),
      });

      const response = await fetch(`${API_BASE_URL}/api/cars?${params.toString()}`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const result = (await response.json()) as CarsResponse;
      const list: Car[] = Array.isArray(result.cars) ? result.cars : [];

      const withAbsoluteImages: Car[] = list.map((c) => ({
        ...c,
        Image: absolutize(c.Image),
      }));

      setCars(withAbsoluteImages);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch cars. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [selectedClass]);

  useEffect(() => {
    loadCars();
  }, [loadCars]);

  return { cars, loading, error };
}