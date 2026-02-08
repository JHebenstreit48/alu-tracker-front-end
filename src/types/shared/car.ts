import type { Blueprints, StockStats, GoldMaxStats, MaxStarStats } from "@/types/CarDetails";
import type { CarStatus } from "@/types/shared/status";

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
}

export type FullCar = Car &
  GoldMaxStats &
  Blueprints &
  StockStats &
  MaxStarStats & {
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