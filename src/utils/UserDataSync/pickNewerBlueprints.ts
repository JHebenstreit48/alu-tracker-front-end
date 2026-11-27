import type { CarTracking } from '@/types/shared/tracking';

type LocalBlueprints = CarTracking['blueprints'];

type ServerBlueprints = {
  ownedByStar?: Record<number, number>;
  updatedAt?: number;
};

// Newest updatedAt wins per car; returns undefined to keep the device copy (missing time = 0, account wins ties)
export function pickNewerBlueprints(
  local: LocalBlueprints,
  server: ServerBlueprints | undefined
): LocalBlueprints | undefined {
  if (!server?.ownedByStar) return undefined;

  const localTime = typeof local?.updatedAt === 'number' ? local.updatedAt : 0;
  const serverTime = typeof server.updatedAt === 'number' ? server.updatedAt : 0;

  // Device has a newer edit that hasn't uploaded yet
  if (localTime > serverTime) return undefined;

  return {
    ...(local ?? {}),
    ownedByStar: server.ownedByStar,
    updatedAt: serverTime,
  };
}