import { useCallback, useState } from 'react';
import type {
  ObtainMethodFilterKey,
  ObtainMethodFilterValues,
} from '@/types/Cars/Filters/ObtainMethodFiltersProps';

export const EMPTY_OBTAIN_METHOD_FILTERS: ObtainMethodFilterValues = {
  area: '',
  section: '',
  pack: '',
  status: '',
};

/** State for the Obtain Method box. Changing the area clears the section. */
export function useObtainMethodFilters() {
  const [values, setValues] = useState<ObtainMethodFilterValues>(EMPTY_OBTAIN_METHOD_FILTERS);

  const setValue = useCallback((key: ObtainMethodFilterKey, value: string) => {
    setValues((prev) =>
      key === 'area' ? { ...prev, area: value, section: '' } : { ...prev, [key]: value }
    );
  }, []);

  const reset = useCallback(() => setValues(EMPTY_OBTAIN_METHOD_FILTERS), []);

  return { values, setValue, reset };
}