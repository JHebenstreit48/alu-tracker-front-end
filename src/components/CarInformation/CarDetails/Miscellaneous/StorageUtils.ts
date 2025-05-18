// StorageUtils.ts

export interface CarTrackingData {
  owned?: boolean;
  stars?: number;
  goldMax?: boolean;
  keyObtained?: boolean;
  upgradeStage?: number;
  importParts?: number;
}

const keyPrefix = "car-tracker-";

function generateCarKey(brand: string, model: string): string {
  return `${brand}_${model}`.toLowerCase().replace(/\s+/g, "_");
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

export { generateCarKey };
