import type { Car } from '@/types/shared/car';

export type SubmissionStatus = 'pending' | 'approved' | 'rejected';

export type StarStatBlock = {
  rank?: number;
  topSpeed?: number;
  acceleration?: number;
  handling?: number;
  nitro?: number;
};

export type CarIdentityPatch = Partial<
  Pick<
    Car,
    | 'class'
    | 'brand'
    | 'model'
    | 'normalizedKey'
    | 'rarity'
    | 'stars'
    | 'country'
    | 'image'
    | 'obtainableVia'
    | 'keyCar'
    | 'sources'
  >
> & {
  status?: 'Coming Soon' | 'Available' | 'Removed';
  message?: string;
};

export type CarStatsPatch = {
  stock?: StarStatBlock;
  maxAtStar?: {
    oneStar?: StarStatBlock;
    twoStar?: StarStatBlock;
    threeStar?: StarStatBlock;
    fourStar?: StarStatBlock;
    fiveStar?: StarStatBlock;
    sixStar?: StarStatBlock;
  };
  gold?: StarStatBlock;
  stages?: Record<string, unknown>;
  blueprints?: Record<string, unknown>;
  importPartsUpgrades?: Record<string, unknown>;
  garageLevelXp?: Record<string, unknown>;
};

export type CarPatch = CarIdentityPatch & {
  stats?: CarStatsPatch;
};

export type CarSubmissionPayload = {
  cars: Record<string, CarPatch>;
  submitterNote?: string;
};