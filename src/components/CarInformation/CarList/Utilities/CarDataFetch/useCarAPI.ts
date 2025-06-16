import { useState, useCallback, useEffect } from "react";
import { Car } from "@/components/CarInformation/CarList/CarFilters/types/CarTypes";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "https://alutracker-api.onrender.com";

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
      const result = await response.json();
      setCars(Array.isArray(result.cars) ? result.cars : []);
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