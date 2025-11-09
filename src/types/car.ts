export interface Car {
    id: string;          // slug / normalizedKey / document id
    Brand: string;
    Model: string;
    Class: string;       // can tighten later to "D" | "C" | ...
    Rarity?: string;
    Stars?: number;
    Image: string;       // "/images/..." or full URL
    [key: string]: unknown;
  }  