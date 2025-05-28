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
  
  export interface CarTrackingData {
    owned: boolean;
  }
  
  