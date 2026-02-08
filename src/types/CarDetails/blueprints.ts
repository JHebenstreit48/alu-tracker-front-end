export interface Blueprints {
  blueprints1Star: number | string;
  blueprints2Star: number;
  blueprints3Star: number;
  blueprints4Star?: number;
  blueprints5Star?: number;
  blueprints6Star?: number;
  Total_BPs?: number | null;
}

export type BlueprintValue = number | string | null;

export interface BlueprintsRow {
  key: string;
  star: number; // 0,1,2,3... (whatever exists)
  value: BlueprintValue; // required BPs (or "?" etc)
}

export interface BlueprintsTrackerState {
  currentStars: number; // 0..maxStars
  maxStars: number; // 3/4/5/6
  goldMaxed?: boolean;
  ownedByStar?: Record<number, number>; // e.g. { 1: 50, 2: 12, 3: 15, 4: 8 }
}