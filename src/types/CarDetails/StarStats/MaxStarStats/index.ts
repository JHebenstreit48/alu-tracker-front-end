import { OneStarMaxStats } from '@/types/CarDetails/StarStats/MaxStarStats/OneStarMaxStats';
import { TwoStarMaxStats } from '@/types/CarDetails/StarStats/MaxStarStats/TwoStarMaxStats';
import { ThreeStarMaxStats } from '@/types/CarDetails/StarStats/MaxStarStats/ThreeStarMaxStats';
import { FourStarMaxStats } from '@/types/CarDetails/StarStats/MaxStarStats/FourStarMaxStats';
import { FiveStarMaxStats } from '@/types/CarDetails/StarStats/MaxStarStats/FiveStarMaxStats';
import { SixStarMaxStats } from '@/types/CarDetails/StarStats/MaxStarStats/SixStarMaxStats';

export * from '@/types/CarDetails/StarStats/MaxStarStats/OneStarMaxStats';
export * from '@/types/CarDetails/StarStats/MaxStarStats/TwoStarMaxStats';
export * from '@/types/CarDetails/StarStats/MaxStarStats/ThreeStarMaxStats';
export * from '@/types/CarDetails/StarStats/MaxStarStats/FourStarMaxStats';
export * from '@/types/CarDetails/StarStats/MaxStarStats/FiveStarMaxStats';
export * from '@/types/CarDetails/StarStats/MaxStarStats/SixStarMaxStats';

export type MaxStarStats =
OneStarMaxStats &
TwoStarMaxStats &
ThreeStarMaxStats &
FourStarMaxStats &
FiveStarMaxStats &
SixStarMaxStats;