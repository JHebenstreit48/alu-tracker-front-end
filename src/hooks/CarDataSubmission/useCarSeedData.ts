import { useState, useEffect } from 'react';
import { fetchCarDetail } from '@/api/carDetails';
import type { FullCar } from '@/types/shared/car';

type SeedState = {
  data: FullCar | null;
  loading: boolean;
  error: string | null;
};

export function useCarSeedData(normalizedKey: string | null): SeedState {
  const [state, setState] = useState<SeedState>({
    data: null,
    loading: false,
    error: null,
  });

  useEffect(() => {
    if (!normalizedKey) {
      setState({ data: null, loading: false, error: null });
      return;
    }

    let alive = true;
    setState({ data: null, loading: true, error: null });

    fetchCarDetail(normalizedKey)
      .then((car) => {
        if (!alive) return;
        setState({ data: car, loading: false, error: null });
      })
      .catch((e: unknown) => {
        if (!alive) return;
        setState({
          data: null,
          loading: false,
          error: e instanceof Error ? e.message : 'Failed to load car data',
        });
      });

    return () => { alive = false; };
  }, [normalizedKey]);

  return state;
}