export interface Car {
    _id?: string; // Optional for flexibility (MongoDB ID)
    Id: number;
    Image: string;
    ImageStatus?: "available" | "coming-soon" | "unavailable";
    Brand: string;
    Model: string;
    Class: string;
    Stars: number;
    KeyCar?: boolean;
  }
  