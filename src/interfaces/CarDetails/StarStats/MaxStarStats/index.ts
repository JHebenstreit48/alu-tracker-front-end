import { OneStarMaxStats } from '@/interfaces/CarDetails/StarStats/MaxStarStats/OneStarMaxStats';
import { TwoStarMaxStats } from '@/interfaces/CarDetails/StarStats/MaxStarStats/TwoStarMaxStats';
import { ThreeStarMaxStats } from '@/interfaces/CarDetails/StarStats/MaxStarStats/ThreeStarMaxStats';
import { FourStarMaxStats } from '@/interfaces/CarDetails/StarStats/MaxStarStats/FourStarMaxStats';
import { FiveStarMaxStats } from '@/interfaces/CarDetails/StarStats/MaxStarStats/FiveStarMaxStats';
import { SixStarMaxStats } from '@/interfaces/CarDetails/StarStats/MaxStarStats/SixStarMaxStats';

export * from '@/interfaces/CarDetails/StarStats/MaxStarStats/OneStarMaxStats';
export * from '@/interfaces/CarDetails/StarStats/MaxStarStats/TwoStarMaxStats';
export * from '@/interfaces/CarDetails/StarStats/MaxStarStats/ThreeStarMaxStats';
export * from '@/interfaces/CarDetails/StarStats/MaxStarStats/FourStarMaxStats';
export * from '@/interfaces/CarDetails/StarStats/MaxStarStats/FiveStarMaxStats';
export * from '@/interfaces/CarDetails/StarStats/MaxStarStats/SixStarMaxStats';

export type MaxStarStats =
OneStarMaxStats &
TwoStarMaxStats &
ThreeStarMaxStats &
FourStarMaxStats &
FiveStarMaxStats &
SixStarMaxStats;