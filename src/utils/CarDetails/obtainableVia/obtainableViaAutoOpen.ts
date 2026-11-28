import type { ObtainableViaEntry } from '@/types/shared/car';

type GroupStatus = ObtainableViaEntry['status'];

const ALWAYS_OPEN: ReadonlyArray<GroupStatus> = ['current', 'upcoming'];
const FALLBACK_ORDER: ReadonlyArray<GroupStatus> = ['inactive', 'original'];

export const getAutoOpenStatus = (groups: ObtainableViaEntry[]): GroupStatus | null => {
  if (groups.some((group) => ALWAYS_OPEN.includes(group.status))) return null;

  for (const status of FALLBACK_ORDER) {
    if (groups.some((group) => group.status === status)) return status;
  }

  return groups[0]?.status ?? null;
};

/** Moves every group with the given status to the top, keeping the rest in order. */
export const promoteStatus = (
  groups: ObtainableViaEntry[],
  status: GroupStatus | null
): ObtainableViaEntry[] => {
  if (!status) return groups;
  return [
    ...groups.filter((group) => group.status === status),
    ...groups.filter((group) => group.status !== status),
  ];
};