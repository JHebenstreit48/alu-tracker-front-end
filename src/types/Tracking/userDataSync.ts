export type CarStarsMap = Record<string, number>;

export type BlueprintsByCarMap = Record<string, Record<number, number>>;

export interface ProgressPayload {
  carStars: CarStarsMap;
  ownedCars: string[];
  goldMaxedCars: string[];
  keyCarsOwned: string[];

  // Existing XP field (kept for compatibility)
  xp: number;

  // Optional Garage Level fields (new)
  currentGarageLevel?: number;
  currentGLXp?: number;
  garageLevelTrackerMode?: string;

  // ✅ ADD: optional blueprint tracking (label → ownedByStar)
  // Example:
  // blueprintsByCar: { "Acura 2017 NSX": { 1: 50, 2: 12, 3: 15, 4: 8 } }
  blueprintsByCar?: BlueprintsByCarMap;
}

export interface SyncOk {
  success: true;
  skipped?: true;
}
export interface SyncErr {
  success: false;
  message: string;
}
export type SyncResult = SyncOk | SyncErr;

export interface PushOptions {
  /**
   * Map of normalized keys (e.g. "acura_2017_nsx") → canonical label
   * (e.g. "Acura 2017 NSX").
   */
  labelByKey?: ReadonlyMap<string, string>;
  /** Abort if the request takes longer than this many ms (default 15000). */
  timeoutMs?: number;
}