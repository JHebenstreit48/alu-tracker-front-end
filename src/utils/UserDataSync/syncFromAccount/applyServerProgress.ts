import {
  setCarTrackingData,
  generateCarKey,
  getCarTrackingData,
} from '@/utils/shared/StorageUtils';
import { pickNewerBlueprints } from '@/utils/UserDataSync/pickNewerBlueprints';
import type { CarTracking } from '@/types/shared/tracking';
import type {
  BlueprintsByCarMap,
  CarStarsMap,
  ServerProgress,
} from '@/types/shared/userDataSync/syncFromAccount';

const KEY_PREFIX = 'car-tracker-';

// "Brand Model" → storage key
function labelToKey(label: string): string {
  const [brand, ...modelParts] = label.split(' ');
  return generateCarKey(brand, modelParts.join(' '));
}

// Writes the server's progress into localStorage (moved unchanged from syncFromAccount)
export function applyServerProgress(p: ServerProgress): void {
  const carStars: CarStarsMap = p.carStars ?? {};
  const ownedCars: string[] = p.ownedCars ?? [];
  const goldMaxedCars: string[] = p.goldMaxedCars ?? [];
  const keyCarsOwned: string[] = p.keyCarsOwned ?? [];

  // ✅ blueprint data
  const blueprintsByCar: BlueprintsByCarMap = p.blueprintsByCar ?? {};

  // Build all server labels → keys
  const allLabels = new Set<string>([
    ...Object.keys(carStars),
    ...ownedCars,
    ...goldMaxedCars,
    ...keyCarsOwned,

    // ✅ include blueprint labels so they don't get pruned
    ...Object.keys(blueprintsByCar),
  ]);

  const serverKeys = new Set<string>();
  for (const label of allLabels) {
    if (typeof label === 'string' && label.trim() !== '') {
      serverKeys.add(labelToKey(label));
    }
  }

  // Remove local entries not on server
  for (let i = 0; i < localStorage.length; i++) {
    const storageKey = localStorage.key(i);
    if (!storageKey || !storageKey.startsWith(KEY_PREFIX)) continue;
    const carKey = storageKey.slice(KEY_PREFIX.length);
    if (!serverKeys.has(carKey)) {
      localStorage.removeItem(storageKey);
      i--;
    }
  }

  // Write exact server truth
  const ownedSet = new Set<string>(ownedCars);
  const goldSet = new Set<string>(goldMaxedCars);
  const keySet = new Set<string>(keyCarsOwned);

  for (const label of allLabels) {
    const key = labelToKey(label);
    const current = getCarTrackingData(key);
    const starsFromServer = carStars[label] ?? 0;

    // ✅ blueprints: newest updatedAt wins (undefined = keep the device copy)
    const nextBlueprints = pickNewerBlueprints(current.blueprints, blueprintsByCar[label]);

    const next: CarTracking = {
      ...current,
      owned: ownedSet.has(label),
      goldMaxed: goldSet.has(label),
      keyObtained: keySet.has(label),
      stars: starsFromServer > 0 ? starsFromServer : undefined,

      ...(nextBlueprints ? { blueprints: nextBlueprints } : {}),
    };

    setCarTrackingData(key, next);
  }
}