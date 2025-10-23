export interface Car {
    Brand: string;
    Model: string;
    Class: string;
    Stars: number;
    Country?: string;
    Image?: string;
    ImageStatus?: "Coming Soon" | "Available" | "Removed";
    KeyCar?: boolean;
    Rarity: string;
  }  
  
  // In CarTypes.ts:
export interface CarTrackingData {
  owned?: boolean;
  stars?: number;
  goldMaxed?: boolean;
  keyObtained?: boolean;
  upgradeStage?: number;
  importParts?: number;
  KeyCar?: boolean;
}

  
  