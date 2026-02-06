import type { Blueprints, StockStats, GoldMaxStats, MaxStarStats } from "@/types/CarDetails";
import type { CarStatus } from "@/types/shared/status";

export interface Car {
  Id: number;
  Image?: string;
  ImageStatus?: "Coming Soon" | "Available" | "Removed";
  Brand: string;
  Model: string;
  Country?: string;
  Rarity: string;
  ObtainableVia?: string[] | string | null;
  Class: string;
  Stars: number;
  KeyCar?: boolean;
  normalizedKey?: string;
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