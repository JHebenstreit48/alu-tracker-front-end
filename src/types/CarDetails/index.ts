import type {
    Car,
    Blueprints,
  } from "@/interfaces/CarDetails";
  import type { StockStats } from "@/interfaces/CarDetails";
  import type { GoldMaxStats } from "@/interfaces/CarDetails";
  import type { MaxStarStats } from "@/interfaces/CarDetails";
  
  export type CarStatus = {
    status: "complete" | "in progress" | "missing" | "unknown";
    message?: string;
    lastChecked?: string | null;
  };
  
  export type ApiStatusDoc = {
    status: string;
    message?: string;
    updatedAt?: string;
    createdAt?: string;
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