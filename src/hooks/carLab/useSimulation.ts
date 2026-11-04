import { useMemo } from 'react';
import { useCarLabCar } from '@/hooks/carLab/useCarLabCar';
import { useCarLabData } from '@/hooks/carLab/useCarLabData';
import { computeSimulatedState } from '@/utils/carLab/computeSimulatedState';

export function useSimulation(slug: string | null, stepId: string | null, onlyLogged: boolean) {
  const list = useCarLabData();
  const { car, loading, error } = useCarLabCar(slug);

  const items = useMemo(
    () => [...list.items].sort((x, y) => x.name.localeCompare(y.name)),
    [list.items]
  );
  const state = useMemo(() => (car ? computeSimulatedState(car) : null), [car]);
  const steps = useMemo(() => {
    if (!state) return [];
    return onlyLogged ? state.steps.filter((step) => step.exact) : state.steps;
  }, [state, onlyLogged]);

  const found = steps.findIndex((step) => step.id === stepId);
  const index = steps.length === 0 ? -1 : found >= 0 ? found : steps.length - 1;
  const selected = index >= 0 ? steps[index] : undefined;
  const selectedIndex = state && selected ? state.steps.findIndex((s) => s.id === selected.id) : -1;

  return {
    items,
    listError: list.error,
    item: items.find((i) => i.slug === slug),
    car,
    loading,
    error,
    state,
    steps,
    index,
    selected,
    selectedIndex,
  };
}