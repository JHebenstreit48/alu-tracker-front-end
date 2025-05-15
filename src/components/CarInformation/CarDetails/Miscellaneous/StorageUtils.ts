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

export function getCarTrackingData(carId: string): CarTrackingData {
  try {
    const data = localStorage.getItem(`${keyPrefix}${carId}`);
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
}

export function setCarTrackingData(
  carId: string,
  update: Partial<CarTrackingData>
) {
  const existing = getCarTrackingData(carId);
  const merged = { ...existing, ...update };
  localStorage.setItem(`${keyPrefix}${carId}`, JSON.stringify(merged));
}

export function getAllCarTrackingData(): Record<string, CarTrackingData> {
  const all: Record<string, CarTrackingData> = {};
  for (const key in localStorage) {
    if (key.startsWith(keyPrefix)) {
      try {
        const carId = key.replace(keyPrefix, "");
        const data = JSON.parse(localStorage.getItem(key)!);
        all[carId] = data;
      } catch {
        continue;
      }
    }
  }
  return all;
}
