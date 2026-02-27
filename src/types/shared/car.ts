import type { Blueprints, StockStats, GoldMaxStats, MaxStarStats } from "@/types/CarDetails";
import type { CarStatus } from "@/types/shared/status";

/** New-format stat block */
export type StatBlock = {
  rank?: number;
  topSpeed?: number;
  acceleration?: number;
  handling?: number;
  nitro?: number;
};

export type MaxStarKey =
  | "oneStar"
  | "twoStar"
  | "threeStar"
  | "fourStar"
  | "fiveStar"
  | "sixStar";

/** New-format containers that match your JSON examples */
export interface NewStatsFormat {
  stock?: { stock?: StatBlock };
  maxStar?: Partial<Record<MaxStarKey, StatBlock>>;
  gold?: { gold?: StatBlock };
}

export interface Car {
  id: number;
  image?: string;
  ImageStatus?: "Coming Soon" | "Available" | "Removed";
  brand: string;
  model: string;
  country?: string;
  rarity: string;
  obtainableVia?: string[] | string | null;
  class: string;
  stars: number;
  keyCar?: boolean;
  normalizedKey?: string;
  sources?: string[];
  addedDate?: string;
}

/**
 * Transitional FullCar:
 * - Keeps OLD flat fields via StockStats/GoldMaxStats/MaxStarStats
 * - Adds NEW nested fields via NewStatsFormat
 */
export type FullCar = Car &
  GoldMaxStats &
  Blueprints &
  StockStats &
  MaxStarStats & 
  NewStatsFormat & {
    updatedAt?: string;
    _status?: CarStatus | null;
    [key: string]: unknown;
  };

export type CarsLocationState = {
  selectedClass?: string;
  trackerMode?: boolean;
} | null;

export type StageSnapshot = {
  stage: number;
  rank?: number;
  topSpeed?: number;
  acceleration?: number;
  handling?: number;
  nitro?: number;
};