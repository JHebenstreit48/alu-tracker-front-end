import { useEffect, useState } from 'react';
import { carsAdapter } from '@/lib/Firebase/carsAdapter';
import type { CarLabListItem } from '@/types/CarLab/carLab';
import { mapListItem } from '@/utils/carLab/mapCar';

interface CarLabListState {
  items: CarLabListItem[];
  loading: boolean;
  error: string | null;
}

let listRequest: Promise<CarLabListItem[]> | null = null;

function loadList(): Promise<CarLabListItem[]> {
  if (!listRequest) {
    listRequest = carsAdapter.list().then((cars) =>
      cars.flatMap((car) => {
        const item = mapListItem(car);
        return item ? [item] : [];
      })
    );
    listRequest.catch(() => {
      listRequest = null;
    });
  }
  return listRequest;
}

export function useCarLabData(): CarLabListState {
  const [state, setState] = useState<CarLabListState>({ items: [], loading: true, error: null });

  useEffect(() => {
    let active = true;
    loadList()
      .then((items) => {
        if (active) setState({ items, loading: false, error: null });
      })
      .catch((err: unknown) => {
        if (!active) return;
        const error = err instanceof Error ? err.message : 'Could not load the car list.';
        setState({ items: [], loading: false, error });
      });
    return () => {
      active = false;
    };
  }, []);

  return state;
}