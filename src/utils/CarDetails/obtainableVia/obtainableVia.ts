import type { Car, ObtainableStatus, ObtainableViaEntry } from '@/types/shared/car';
import {
  LEGACY_AREA,
  type NormalizedMethod,
} from '@/utils/CarDetails/obtainableVia/obtainableViaDates';

/** Legacy shapes: string[], a single string, or no data. */
export type LegacyObtainableVia = Exclude<Car['obtainableVia'], ObtainableViaEntry[]>;

export type MethodAreaGroup = {
  area: string;
  methods: NormalizedMethod[];
};

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

/** Display order for areas inside a status group; legacy methods last. */
const AREA_ORDER: readonly string[] = [
  'Daily Events',
  'Special Events',
  'Career',
  'Multiplayer',
  'Shop',
  'Passes',
  'Login Rewards',
  'Gameloft Shop',
  'Redeem Codes',
  LEGACY_AREA,
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

/** Unknown areas sort just before legacy methods. */
function areaRank(area: string): number {
  const index = AREA_ORDER.indexOf(area);
  return index === -1 ? AREA_ORDER.length - 1.5 : index;
}

/** Returns a sorted copy; the original array is not changed. */
export function sortObtainableGroups(groups: ObtainableViaEntry[]): ObtainableViaEntry[] {
  return [...groups].sort((a, b) => statusRank(a.status) - statusRank(b.status));
}

/** Groups methods by area, keeping their order inside each area. */
export function groupMethodsByArea(methods: NormalizedMethod[]): MethodAreaGroup[] {
  const groups = new Map<string, NormalizedMethod[]>();
  for (const method of methods) {
    const list = groups.get(method.area);
    if (list) list.push(method);
    else groups.set(method.area, [method]);
  }
  return [...groups.entries()]
    .map(([area, list]) => ({ area, methods: list }))
    .sort((a, b) => areaRank(a.area) - areaRank(b.area));
}

/** Legacy data as a list of method strings (empty list = no data). */
export function getLegacyMethods(value: LegacyObtainableVia): string[] {
  if (Array.isArray(value)) {
    return value.map((method) => method.trim()).filter((method) => method.length > 0);
  }
  if (typeof value === 'string' && value.trim()) return [value.trim()];
  return [];
}