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

/** Structured method (future backend format): dates as ISO strings, e.g. "2026-09-15" */
export type ObtainableMethodObject = {
  name: string;
  start?: string;
  end?: string;
};

/**
 * A method is either the current string format, e.g. "Legend Pass (Sep 15 - Oct 14, 2026)",
 * or the structured object format. Both render the same way.
 */
export type ObtainableMethod = string | ObtainableMethodObject;

/** Single group in the obtainableVia array — groups methods by status */
export type ObtainableViaEntry = {
  status: "original" | "upcoming" | "current" | "recent" | "inactive" | "obsolete" | "removed";
  methods: ObtainableMethod[];
  removedDate?: string;
  reason?: string;
};

/** The status values above, as their own type (used by the utils) */
export type ObtainableStatus = ObtainableViaEntry["status"];

export interface Car {
  id: number;
  image?: string;
  imageStatus?: "Coming Soon" | "Available" | "Removed";
  brand: string;
  model: string;
  country?: string;
  rarity: string;
  /**
   * New format: array of { status, methods[] } objects grouped by status
   * Legacy format: array of strings or a single string
   * Empty array or null = no data yet
   */
  obtainableVia?: ObtainableViaEntry[] | string[] | string | null;
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