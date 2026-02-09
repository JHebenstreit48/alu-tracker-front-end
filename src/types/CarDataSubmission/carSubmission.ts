import type { Car } from "@/types/shared/car";

export type SubmissionStatus = "pending" | "approved" | "rejected";

export type CarIdentityPatch = Partial<
  Pick<
    Car,
    | "class"
    | "brand"
    | "model"
    | "normalizedKey"
    | "rarity"
    | "stars"
    | "country"
    | "image"
    | "obtainableVia"
    | "keyCar"
    | "sources"
  >
> & {
  // optional admin-ish metadata you already use elsewhere
  status?: "Coming Soon" | "Available" | "Removed";
  message?: string;
};

export type CarStatsPatch = {
  // keep flexible so you can evolve the schema car-by-car
  stock?: Record<string, unknown>;
  maxAtStar?: Record<string, unknown>;
  gold?: Record<string, unknown>;
  stages?: Record<string, unknown>;
  blueprints?: Record<string, unknown>;
  importPartsUpgrades?: Record<string, unknown>;
  garageLevelXp?: Record<string, unknown>;
};

export type CarPatch = CarIdentityPatch & {
  stats?: CarStatsPatch;
};

export type CarSubmissionPayload = {
  cars: Record<string, CarPatch>; // key = normalizedKey
  submitterNote?: string;
};