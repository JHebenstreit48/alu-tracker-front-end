import type { Car } from '@/types/shared/car';

export type ObtainMethodFilterKey = 'area' | 'section' | 'pack' | 'status';

export type ObtainMethodFilterValues = Record<ObtainMethodFilterKey, string>;

export interface ObtainMethodFiltersProps {
  cars: Car[];
  values: ObtainMethodFilterValues;
  onChange: (key: ObtainMethodFilterKey, value: string) => void;
  onReset: () => void;
}