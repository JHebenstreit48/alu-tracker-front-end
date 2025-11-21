export interface CarTracking {
    owned?: boolean;
    isOwned?: boolean;
    hasCar?: boolean;
    hasOwned?: boolean;
    stars?: number;
    goldMaxed?: boolean;
    isGoldMaxed?: boolean;
    maxed?: boolean;
    isMaxed?: boolean;
    keyObtained?: boolean;
    upgradeStage?: number;
    importParts?: number;
    KeyCar?: boolean;
  }
  
  export type CarTrackingMap = Record<string, CarTracking>;