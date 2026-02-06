import type { CarTracking } from "@/types/shared/tracking";

const keyPrefix = "car-tracker-";

export function normalizeString(input: unknown): string {
  const str = typeof input === "string" ? input : input == null ? "" : String(input);

  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\./g, "")
    .replace(/-/g, "_")
    .replace(/\s+/g, "_")
    .replace(/[^a-z0-9_]/g, "");
}

export function generateCarKey(brand: unknown, model: unknown): string {
  return normalizeString(`${brand ?? ""}_${model ?? ""}`);
}

export function getCarTrackingData(carKey: string): CarTracking {
  try {
    const data = localStorage.getItem(`${keyPrefix}${carKey}`);
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
}

export function setCarTrackingData(carKey: string, update: Partial<CarTracking>) {
  const existing = getCarTrackingData(carKey);
  const merged = { ...existing, ...update };
  localStorage.setItem(`${keyPrefix}${carKey}`, JSON.stringify(merged));
}

export function getAllCarTrackingData(): Record<string, CarTracking> {
  const all: Record<string, CarTracking> = {};
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

export function clearOwnership(carKey: string): void {
  const prev = getCarTrackingData(carKey);
  setCarTrackingData(carKey, {
    ...prev,
    keyObtained: false,
    owned: false,
    goldMaxed: false,
  });
}

export function setKeyObtainedState(carKey: string, obtained: boolean): void {
  const prev = getCarTrackingData(carKey);
  if (obtained) {
    setCarTrackingData(carKey, {
      ...prev,
      keyObtained: true,
      owned: true,
    });
  } else {
    setCarTrackingData(carKey, {
      ...prev,
      keyObtained: false,
      owned: false,
      goldMaxed: false,
    });
  }
}