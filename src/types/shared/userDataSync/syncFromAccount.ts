export type CarStarsMap = Record<string, number>;

// Blueprint entry matches backend shape (updatedAt may be missing on older data)
export type BlueprintSyncEntry = {
  ownedByStar: Record<number, number>;
  updatedAt?: number;
};

export type BlueprintsByCarMap = Record<string, BlueprintSyncEntry>;

export interface ServerProgress {
  carStars?: CarStarsMap;
  ownedCars?: string[];
  goldMaxedCars?: string[];
  keyCarsOwned?: string[];
  xp?: number;
  blueprintsByCar?: BlueprintsByCarMap;
}

export interface ProgressResponse {
  progress?: ServerProgress;
}

export interface PullResult {
  success: boolean;
  message?: string;
}