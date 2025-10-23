import type {
    Car,
    Blueprints,
  } from "@/components/Cars/CarDetails/Miscellaneous/Interfaces";
  import type { StockStats } from "@/components/Cars/CarDetails/Miscellaneous/Interfaces/StarStats/StockStats";
  import type { GoldMaxStats } from "@/components/Cars/CarDetails/Miscellaneous/Interfaces/StarStats/GoldMaxStats";
  import type { MaxStarStats } from "@/components/Cars/CarDetails/Miscellaneous/Interfaces/StarStats/MaxStarStats";
  
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