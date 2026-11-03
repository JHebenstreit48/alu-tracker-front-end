import { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { ScaleMode, StatKey } from '@/types/CarLab/carLab';
import type { ChartView, Slot } from '@/types/CarLab/compare';
import { STAT_KEYS } from '@/utils/carLab/values';

const SCALES: readonly ScaleMode[] = ['abs', 'gain', 'pct'];
const VIEWS: readonly ChartView[] = ['line', 'bar'];

function pick<T extends string>(value: string | null, allowed: readonly T[], fallback: T): T {
  return allowed.find((option) => option === value) ?? fallback;
}

export function useCompareState() {
  const [params, setParams] = useSearchParams();

  const update = useCallback(
    (key: string, value: string | null) => {
      setParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          if (value) next.set(key, value);
          else next.delete(key);
          return next;
        },
        { replace: true }
      );
    },
    [setParams]
  );

  return {
    a: params.get('a'),
    b: params.get('b'),
    point: params.get('p'),
    stat: pick<StatKey>(params.get('k'), STAT_KEYS, 'rank'),
    scale: pick<ScaleMode>(params.get('scale'), SCALES, 'abs'),
    view: pick<ChartView>(params.get('view'), VIEWS, 'line'),
    setCar: (slot: Slot, slug: string | null) => update(slot, slug),
    setPoint: (id: string) => update('p', id),
    setStat: (key: StatKey) => update('k', key),
    setScale: (scale: ScaleMode) => update('scale', scale),
    setView: (view: ChartView) => update('view', view),
  };
}