import { useCallback, useState } from 'react';
import type { ObtainableViaEntry } from '@/types/shared/car';

type GroupStatus = ObtainableViaEntry['status'];

const OPEN_BY_DEFAULT: ReadonlySet<GroupStatus> = new Set<GroupStatus>(['current', 'upcoming']);

export const isOpenByDefault = (status: GroupStatus): boolean => OPEN_BY_DEFAULT.has(status);

const useCollapsedGroups = (autoOpenStatus: GroupStatus | null = null) => {
  const [overrides, setOverrides] = useState<Record<string, boolean>>({});

  const startsOpen = useCallback(
    (status: GroupStatus): boolean => isOpenByDefault(status) || status === autoOpenStatus,
    [autoOpenStatus]
  );

  const isOpen = useCallback(
    (key: string, status: GroupStatus): boolean => overrides[key] ?? startsOpen(status),
    [overrides, startsOpen]
  );

  const toggle = useCallback(
    (key: string, status: GroupStatus): void => {
      setOverrides((prev) => ({ ...prev, [key]: !(prev[key] ?? startsOpen(status)) }));
    },
    [startsOpen]
  );

  return { isOpen, toggle };
};

export default useCollapsedGroups;