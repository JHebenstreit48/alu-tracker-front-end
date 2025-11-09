export interface Car {
    brand: string;
    model: string;
    image: string; // final URL or resolvable path
  }
  
  export interface GarageLevelsInterface {
    GarageLevelKey: number;
    xp: number;
    cars: Car[];
  }
  
  // Optional aliases if you like the shorter names
  export type GarageLevelCar = Car;
  export type GarageLevel = GarageLevelsInterface;  