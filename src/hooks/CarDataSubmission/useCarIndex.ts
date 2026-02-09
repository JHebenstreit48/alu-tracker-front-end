import { useEffect, useMemo, useState } from "react";
import type { Car } from "@/types/shared/car";
import { carsAdapter } from "@/lib/Firebase/carsAdapter";

export function useCarIndex() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;

    (async () => {
      setLoading(true);
      setError(null);
      try {
        const list = await carsAdapter.list(5000);
        if (!alive) return;
        setCars(list);
      } catch (e: any) {
        if (!alive) return;
        setError(e?.message || "Failed to load cars");
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  const brands = useMemo(() => {
    const set = new Set<string>();
    for (const c of cars) if (c.brand) set.add(c.brand);
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [cars]);

  return { cars, brands, loading, error };
}