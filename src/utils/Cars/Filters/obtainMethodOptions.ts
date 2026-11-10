import type { Car, ObtainableStatus } from '@/types/shared/car';
import type { ObtainMethodFilterValues } from '@/types/Cars/Filters/ObtainMethodFiltersProps';
import { collectObtainMethods } from '@/utils/Cars/Filters/matchObtainMethod';

const PACK_ORDER = ['D', 'D+', 'C', 'C+', 'B', 'B+', 'A', 'A+', 'S', 'S+'];

/** Every status is always offered, so the saved choice exists even before cars load. */
const STATUS_ORDER: readonly ObtainableStatus[] = [
  'current',
  'upcoming',
  'recent',
  'original',
  'inactive',
  'obsolete',
  'removed',
];

export type ObtainMethodOptions = {
  areas: string[];
  sections: string[];
  packs: string[];
  statuses: readonly ObtainableStatus[];
};

/** Unique, sorted values; the currently selected value is kept even if no longer present. */
function sortedUnique(values: (string | undefined)[], selected = ''): string[] {
  const present = values.filter((value): value is string => Boolean(value));
  if (selected) present.push(selected);
  return [...new Set(present)].sort((a, b) => a.localeCompare(b));
}

function packRank(pack: string): number {
  const index = PACK_ORDER.indexOf(pack);
  return index === -1 ? PACK_ORDER.length : index;
}

/** Dropdown options limited to the chosen status; sections also narrow to the chosen area. */
export function getObtainMethodOptions(cars: Car[], values: ObtainMethodFilterValues): ObtainMethodOptions {
  const entries = cars
    .flatMap(collectObtainMethods)
    .filter((entry) => !values.status || entry.status === values.status);
  const inArea = values.area
    ? entries.filter((entry) => entry.method.area === values.area)
    : entries;

  return {
    areas: sortedUnique(entries.map((entry) => entry.method.area), values.area),
    sections: sortedUnique(inArea.map((entry) => entry.method.section), values.section),
    packs: sortedUnique(entries.map((entry) => entry.method.pack), values.pack).sort(
      (a, b) => packRank(a) - packRank(b)
    ),
    statuses: STATUS_ORDER,
  };
}