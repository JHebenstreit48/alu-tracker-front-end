import type { Car, ObtainableMethodObject, ObtainableStatus } from '@/types/shared/car';
import type { ObtainMethodFilterValues } from '@/types/Cars/Filters/ObtainMethodFiltersProps';
import { isGroupedObtainableVia } from '@/utils/CarDetails/obtainableVia';

export type StatusMethod = {
  status: ObtainableStatus;
  method: ObtainableMethodObject;
};

/** Every object-format method on a car, paired with its status group. Strings are skipped. */
export function collectObtainMethods(car: Car): StatusMethod[] {
  if (!isGroupedObtainableVia(car.obtainableVia)) return [];
  return car.obtainableVia.flatMap((group) =>
    group.methods
      .filter((method): method is ObtainableMethodObject => typeof method === 'object' && method !== null)
      .map((method) => ({ status: group.status, method }))
  );
}

/** Status alone doesn't filter; it narrows results once area, section or pack is chosen. */
export function hasObtainMethodFilter(values: ObtainMethodFilterValues): boolean {
  return Boolean(values.area || values.section || values.pack);
}

function methodMatches({ status, method }: StatusMethod, values: ObtainMethodFilterValues): boolean {
  if (values.status && status !== values.status) return false;
  if (values.area && method.area !== values.area) return false;
  if (values.section && method.section !== values.section) return false;
  if (values.pack && method.pack !== values.pack) return false;
  return true;
}

/** True when no filter is set, or when any single method matches every chosen filter. */
export function matchesObtainMethod(car: Car, values: ObtainMethodFilterValues): boolean {
  if (!hasObtainMethodFilter(values)) return true;
  return collectObtainMethods(car).some((entry) => methodMatches(entry, values));
}