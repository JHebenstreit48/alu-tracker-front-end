export interface CarTrackingData {
  owned?: boolean;
  stars?: number;
  goldMaxed?: boolean;
  keyObtained?: boolean;
  upgradeStage?: number;
  importParts?: number;
  KeyCar?: boolean;
}

const keyPrefix = "car-tracker-";

export function normalizeString(str: string): string {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove accents
    .toLowerCase()
    .replace(/\./g, "")              // Remove periods
    .replace(/-/g, "_")              // Replace dashes with underscores
    .replace(/\s+/g, "_")            // Replace spaces with underscores
    .replace(/[^a-z0-9_]/g, "");     // Remove anything else weird
}

export function generateCarKey(brand: string, model: string): string {
  return normalizeString(`${brand}_${model}`);
}

export function getCarTrackingData(carKey: string): CarTrackingData {
  try {
    const data = localStorage.getItem(`${keyPrefix}${carKey}`);
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
}

export function setCarTrackingData(
  carKey: string,
  update: Partial<CarTrackingData>
) {
  const existing = getCarTrackingData(carKey);
  const merged = { ...existing, ...update };
  localStorage.setItem(`${keyPrefix}${carKey}`, JSON.stringify(merged));
}

export function getAllCarTrackingData(): Record<string, CarTrackingData> {
  const all: Record<string, CarTrackingData> = {};
  for (const key in localStorage) {
    if (key.startsWith(keyPrefix)) {
      try {
        const carKey = key.replace(keyPrefix, "");
        const data = JSON.parse(localStorage.getItem(key)!);
        all[carKey] = data;
      } catch {
        continue;
      }
    }
  }
  return all;
}

export function clearAllCarTrackingData() {
  for (const key in localStorage) {
    if (key.startsWith(keyPrefix)) {
      localStorage.removeItem(key);
    }
  }
}

/** Clear all ownership flags for a car (does not touch stars). */
export function clearOwnership(carKey: string): void {
  const prev = getCarTrackingData(carKey);
  setCarTrackingData(carKey, {
    ...prev,
    keyObtained: false,
    owned: false,
    goldMaxed: false,
  });
}

/** Set Key Obtained on/off using the final rules (does not touch stars). */
export function setKeyObtainedState(
  carKey: string,
  obtained: boolean
): void {
  const prev = getCarTrackingData(carKey);
  if (obtained) {
    // Checking ⇒ also Owned = true
    setCarTrackingData(carKey, {
      ...prev,
      keyObtained: true,
      owned: true,
    });
  } else {
    // Unchecking (mistake fix) ⇒ clear Key, Owned, Gold
    setCarTrackingData(carKey, {
      ...prev,
      keyObtained: false,
      owned: false,
      goldMaxed: false,
    });
  }
}