import type { Car, ObtainableStatus } from '@/types/shared/car';
import type { ObtainMethodFilterValues } from '@/types/Cars/Filters/ObtainMethodFiltersProps';
import { collectObtainMethods, statusMatches } from '@/utils/Cars/Filters/matchObtainMethod';

const PACK_ORDER = ['D', 'D+', 'C', 'C+', 'B', 'B+', 'A', 'A+', 'S', 'S+'];

const CUP_ORDER = [
  'Class D Cup',
  'Class C Cup',
  'Class B Cup',
  'Class A Cup',
  'Class S Cup',
  'Open Class Cup',
  'Deluxe Class Cup',
];

/** Cups have their own dropdown, so this section is left out of Section. */
const CUPS_SECTION = 'Cups';

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
  cups: string[];
  packs: string[];
  statuses: readonly ObtainableStatus[];
};

/** "Class D Cup" -> "D", "Open Class Cup" -> "Open", "Deluxe Class Cup" -> "Deluxe" */
export function cupLabel(cup: string): string {
  return cup.replace(/^Class /, '').replace(/ Class Cup$/, '').replace(/ Cup$/, '');
}

/** Unique, sorted values; the currently selected value is kept even if no longer present. */
function sortedUnique(values: (string | undefined)[], selected = ''): string[] {
  const present = values.filter((value): value is string => Boolean(value));
  if (selected) present.push(selected);
  return [...new Set(present)].sort((a, b) => a.localeCompare(b));
}

function rankIn(order: readonly string[], value: string): number {
  const index = order.indexOf(value);
  return index === -1 ? order.length : index;
}

/** Dropdown options limited to the chosen status; sections also narrow to the chosen area. */
export function getObtainMethodOptions(cars: Car[], values: ObtainMethodFilterValues): ObtainMethodOptions {
  const entries = cars
    .flatMap(collectObtainMethods)
    .filter((entry) => statusMatches(entry, values.status));
  const inArea = values.area
    ? entries.filter((entry) => entry.method.area === values.area)
    : entries;
  const sectionNames = inArea
    .map((entry) => entry.method.section)
    .filter((section) => section !== CUPS_SECTION);

  return {
    areas: sortedUnique(entries.map((entry) => entry.method.area), values.area),
    sections: sortedUnique(sectionNames, values.section),
    cups: sortedUnique(entries.flatMap((entry) => entry.method.from ?? []), values.cup).sort(
      (a, b) => rankIn(CUP_ORDER, a) - rankIn(CUP_ORDER, b)
    ),
    packs: sortedUnique(entries.map((entry) => entry.method.pack), values.pack).sort(
      (a, b) => rankIn(PACK_ORDER, a) - rankIn(PACK_ORDER, b)
    ),
    statuses: STATUS_ORDER,
  };
}