import type { Car, ObtainableStatus, ObtainableViaEntry } from '@/types/shared/car';

/** Legacy shapes: string[], a single string, or no data. */
export type LegacyObtainableVia = Exclude<Car['obtainableVia'], ObtainableViaEntry[]>;

/** Display order: what's available now first, history last. */
const STATUS_ORDER: readonly ObtainableStatus[] = [
  'current',
  'upcoming',
  'recent',
  'original',
  'inactive',
  'obsolete',
  'removed',
];

/** True when obtainableVia uses the grouped { status, methods[] } format. */
export function isGroupedObtainableVia(
  value: Car['obtainableVia']
): value is ObtainableViaEntry[] {
  return (
    Array.isArray(value) &&
    value.length > 0 &&
    typeof value[0] === 'object' &&
    value[0] !== null &&
    'methods' in value[0]
  );
}

/** "current" -> "Current" */
export function formatStatus(status: ObtainableStatus): string {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

/** Unknown statuses (bad data) sort to the end instead of breaking the sort. */
function statusRank(status: ObtainableStatus): number {
  const index = STATUS_ORDER.indexOf(status);
  return index === -1 ? STATUS_ORDER.length : index;
}

/** Returns a sorted copy; the original array is not changed. */
export function sortObtainableGroups(groups: ObtainableViaEntry[]): ObtainableViaEntry[] {
  return [...groups].sort((a, b) => statusRank(a.status) - statusRank(b.status));
}

/** Legacy data as a list of method strings (empty list = no data). */
export function getLegacyMethods(value: LegacyObtainableVia): string[] {
  if (Array.isArray(value)) {
    return value.map((method) => method.trim()).filter((method) => method.length > 0);
  }
  if (typeof value === 'string' && value.trim()) return [value.trim()];
  return [];
}