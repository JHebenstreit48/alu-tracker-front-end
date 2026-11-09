import type { Car, ObtainableStatus } from '@/types/shared/car';
import { collectObtainMethods } from '@/utils/Cars/Filters/matchObtainMethod';

const PACK_ORDER = ['D', 'D+', 'C', 'C+', 'B', 'B+', 'A', 'A+', 'S', 'S+'];

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
  statuses: ObtainableStatus[];
};

function sortedUnique(values: (string | undefined)[]): string[] {
  const present = values.filter((value): value is string => Boolean(value));
  return [...new Set(present)].sort((a, b) => a.localeCompare(b));
}

function packRank(pack: string): number {
  const index = PACK_ORDER.indexOf(pack);
  return index === -1 ? PACK_ORDER.length : index;
}

/** Dropdown options built from the data itself; sections narrow to the chosen area. */
export function getObtainMethodOptions(cars: Car[], selectedArea: string): ObtainMethodOptions {
  const entries = cars.flatMap(collectObtainMethods);
  const inArea = selectedArea
    ? entries.filter((entry) => entry.method.area === selectedArea)
    : entries;
  const statusSet = new Set(entries.map((entry) => entry.status));

  return {
    areas: sortedUnique(entries.map((entry) => entry.method.area)),
    sections: sortedUnique(inArea.map((entry) => entry.method.section)),
    packs: sortedUnique(entries.map((entry) => entry.method.pack)).sort(
      (a, b) => packRank(a) - packRank(b)
    ),
    statuses: STATUS_ORDER.filter((status) => statusSet.has(status)),
  };
}