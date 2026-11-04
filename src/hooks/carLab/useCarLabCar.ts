import { useEffect, useState } from 'react';
import { fetchCarDetail } from '@/api/carDetails';
import type { CarLabCar } from '@/types/CarLab/carLab';
import { mapFullCar } from '@/utils/carLab/mapCar';

interface CarLabCarState {
  car: CarLabCar | null;
  loading: boolean;
  error: string | null;
}

const cache = new Map<string, Promise<CarLabCar>>();

function loadCar(slug: string): Promise<CarLabCar> {
  const hit = cache.get(slug);
  if (hit) return hit;
  const request = fetchCarDetail(slug).then((full) => mapFullCar(slug, full));
  cache.set(slug, request);
  request.catch(() => {
    cache.delete(slug);
  });
  return request;
}

export function useCarLabCar(slug: string | null): CarLabCarState {
  const [state, setState] = useState<CarLabCarState>({
    car: null,
    loading: Boolean(slug),
    error: null,
  });

  useEffect(() => {
    if (!slug) {
      setState({ car: null, loading: false, error: null });
      return undefined;
    }
    let active = true;
    setState({ car: null, loading: true, error: null });
    loadCar(slug)
      .then((car) => {
        if (active) setState({ car, loading: false, error: null });
      })
      .catch((err: unknown) => {
        if (!active) return;
        const error = err instanceof Error ? err.message : 'Could not load this car.';
        setState({ car: null, loading: false, error });
      });
    return () => {
      active = false;
    };
  }, [slug]);

  return state;
}