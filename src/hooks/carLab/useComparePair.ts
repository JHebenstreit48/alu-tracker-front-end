import { useMemo } from 'react';
import { useCarLabCar } from '@/hooks/carLab/useCarLabCar';
import { useCarLabData } from '@/hooks/carLab/useCarLabData';
import type { CarLabPoint } from '@/types/CarLab/carLab';
import { buildPoints, sharedPoints } from '@/utils/carLab/points';

function resolvePoint(shared: CarLabPoint[], requested: string | null): CarLabPoint | undefined {
  return (
    shared.find((p) => p.id === requested) ??
    shared.find((p) => p.id === 'gold') ??
    shared[shared.length - 1]
  );
}

export function useComparePair(
  slugA: string | null,
  slugB: string | null,
  requested: string | null
) {
  const list = useCarLabData();
  const carA = useCarLabCar(slugA);
  const carB = useCarLabCar(slugB);

  const items = useMemo(
    () => [...list.items].sort((x, y) => x.name.localeCompare(y.name)),
    [list.items]
  );
  const pointsA = useMemo(() => (carA.car ? buildPoints(carA.car) : []), [carA.car]);
  const pointsB = useMemo(() => (carB.car ? buildPoints(carB.car) : []), [carB.car]);
  const shared = useMemo(() => sharedPoints(pointsA, pointsB), [pointsA, pointsB]);

  return {
    items,
    listLoading: list.loading,
    listError: list.error,
    itemA: items.find((i) => i.slug === slugA),
    itemB: items.find((i) => i.slug === slugB),
    carA,
    carB,
    pointsA,
    pointsB,
    shared,
    active: resolvePoint(shared, requested),
  };
}