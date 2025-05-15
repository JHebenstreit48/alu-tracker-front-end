interface CarTrackingProgress {
    carId: string;
    owned: boolean;
    currentStars: number;
    upgradeStage: number;
    importParts: number;
  }
  
  const STORAGE_KEY = "car_tracking_data";
  
  export function saveCarTrackingProgress(entry: CarTrackingProgress) {
    const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    const updated = [...existing.filter((e: CarTrackingProgress) => e.carId !== entry.carId), entry];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }
  
  export function loadCarTrackingProgress(carId: string): CarTrackingProgress | null {
    const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return existing.find((e: CarTrackingProgress) => e.carId === carId) || null;
  }
  
  export function getTrackedCars(): CarTrackingProgress[] {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  }
  