export interface Car {
  Id: number;
  Image: string;
  ImageStatus?: 'available' | 'coming-soon' | 'unavailable';
  Brand: string;
  Model: string;
  Country: string;
  Rarity: string;
  ObtainableVia: string[] | string | null;
  Class: string;
  Stars: number;
  KeyCar?: boolean;
}

// Join nicely for display
export const normalizeObtainableVia = (v: Car['ObtainableVia']): string[] =>
  Array.isArray(v) ? v : typeof v === 'string' ? [v] : [];
