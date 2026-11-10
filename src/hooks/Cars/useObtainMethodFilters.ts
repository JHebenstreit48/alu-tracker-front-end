import { useCallback, useEffect, useState } from 'react';
import type {
  ObtainMethodFilterKey,
  ObtainMethodFilterValues,
} from '@/types/Cars/Filters/ObtainMethodFiltersProps';

const STORAGE_KEY = 'obtainMethodFilters';

export const EMPTY_OBTAIN_METHOD_FILTERS: ObtainMethodFilterValues = {
  area: '',
  section: '',
  pack: '',
  status: '',
};

/** Saved filters from localStorage, or empty ones if missing or invalid. */
function loadSavedFilters(): ObtainMethodFilterValues {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY_OBTAIN_METHOD_FILTERS;
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== 'object' || parsed === null) return EMPTY_OBTAIN_METHOD_FILTERS;

    const saved = parsed as Partial<Record<ObtainMethodFilterKey, unknown>>;
    const read = (key: ObtainMethodFilterKey): string =>
      typeof saved[key] === 'string' ? (saved[key] as string) : '';

    return { area: read('area'), section: read('section'), pack: read('pack'), status: read('status') };
  } catch {
    return EMPTY_OBTAIN_METHOD_FILTERS;
  }
}

/** State for the Obtain Method box, kept across page refreshes. */
export function useObtainMethodFilters() {
  const [values, setValues] = useState<ObtainMethodFilterValues>(loadSavedFilters);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(values));
    } catch {
      // Storage unavailable (private mode or blocked): filters still work, just not saved
    }
  }, [values]);

  const setValue = useCallback((key: ObtainMethodFilterKey, value: string) => {
    setValues((prev) =>
      key === 'area' ? { ...prev, area: value, section: '' } : { ...prev, [key]: value }
    );
  }, []);

  const reset = useCallback(() => setValues(EMPTY_OBTAIN_METHOD_FILTERS), []);

  return { values, setValue, reset };
}