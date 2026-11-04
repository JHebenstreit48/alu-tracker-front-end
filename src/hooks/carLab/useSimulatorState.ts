import { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';

export function useSimulatorState() {
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
    slug: params.get('c'),
    step: params.get('step'),
    onlyLogged: params.get('logged') === '1',
    setSlug: (slug: string | null) => update('c', slug),
    setStep: (id: string) => update('step', id),
    setOnlyLogged: (on: boolean) => update('logged', on ? '1' : null),
  };
}