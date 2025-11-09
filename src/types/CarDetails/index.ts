import type { Car, Blueprints } from "@/interfaces/CarDetails";
import type { StockStats } from "@/interfaces/CarDetails";
import type { GoldMaxStats } from "@/interfaces/CarDetails";
import type { MaxStarStats } from "@/interfaces/CarDetails";

export type FirestoreTimestampJson = {
  _seconds: number;
  _nanoseconds: number;
};

export type CarStatus = {
  status: "complete" | "in progress" | "missing" | "unknown";
  message?: string;
  lastChecked?: string | null; // ISO string; UI will localize
};

export type ApiStatusDoc = {
  status: string;
  message?: string;
  updatedAt?: string | FirestoreTimestampJson;
  createdAt?: string | FirestoreTimestampJson;
};

export type FullCar = Car &
  GoldMaxStats &
  Blueprints &
  StockStats &
  MaxStarStats & {
    updatedAt?: string;
    _status?: CarStatus | null;
  };

export type CarsLocationState = {
  selectedClass?: string;
  trackerMode?: boolean;
} | null;