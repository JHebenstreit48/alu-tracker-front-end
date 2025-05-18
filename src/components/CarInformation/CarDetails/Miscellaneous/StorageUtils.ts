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

export function generateTrackingKey(brand: string, model: string): string {
  return `${keyPrefix}${brand.toLowerCase().replace(/\s+/g, "_")}_${model.toLowerCase().replace(/\s+/g, "_")}`;
}

export function getCarTrackingData(brand: string, model: string): CarTrackingData {
  const key = generateTrackingKey(brand, model);
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
}

export function setCarTrackingData(
  brand: string,
  model: string,
  update: Partial<CarTrackingData>
) {
  const key = generateTrackingKey(brand, model);
  const existing = getCarTrackingData(brand, model);
  const merged = { ...existing, ...update };
  localStorage.setItem(key, JSON.stringify(merged));
}

export function getAllCarTrackingData(): Record<string, CarTrackingData> {
  const all: Record<string, CarTrackingData> = {};
  for (const key in localStorage) {
    if (key.startsWith(keyPrefix)) {
      try {
        const id = key.replace(keyPrefix, "");
        const data = JSON.parse(localStorage.getItem(key)!);
        all[id] = data;
      } catch {
        continue;
      }
    }
  }
  return all;
}
