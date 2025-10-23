import { OneStarMaxStats } from '@/components/Cars/CarDetails/Miscellaneous/Interfaces/StarStats/MaxStarStats/OneStarMaxStats';
import { TwoStarMaxStats } from '@/components/Cars/CarDetails/Miscellaneous/Interfaces/StarStats/MaxStarStats/TwoStarMaxStats';
import { ThreeStarMaxStats } from '@/components/Cars/CarDetails/Miscellaneous/Interfaces/StarStats/MaxStarStats/ThreeStarMaxStats';
import { FourStarMaxStats } from '@/components/Cars/CarDetails/Miscellaneous/Interfaces/StarStats/MaxStarStats/FourStarMaxStats';
import { FiveStarMaxStats } from '@/components/Cars/CarDetails/Miscellaneous/Interfaces/StarStats/MaxStarStats/FiveStarMaxStats';
import { SixStarMaxStats } from '@/components/Cars/CarDetails/Miscellaneous/Interfaces/StarStats/MaxStarStats/SixStarMaxStats';

export * from '@/components/Cars/CarDetails/Miscellaneous/Interfaces/StarStats/MaxStarStats/OneStarMaxStats';
export * from '@/components/Cars/CarDetails/Miscellaneous/Interfaces/StarStats/MaxStarStats/TwoStarMaxStats';
export * from '@/components/Cars/CarDetails/Miscellaneous/Interfaces/StarStats/MaxStarStats/ThreeStarMaxStats';
export * from '@/components/Cars/CarDetails/Miscellaneous/Interfaces/StarStats/MaxStarStats/FourStarMaxStats';
export * from '@/components/Cars/CarDetails/Miscellaneous/Interfaces/StarStats/MaxStarStats/FiveStarMaxStats';
export * from '@/components/Cars/CarDetails/Miscellaneous/Interfaces/StarStats/MaxStarStats/SixStarMaxStats';

export type MaxStarStats =
OneStarMaxStats &
TwoStarMaxStats &
ThreeStarMaxStats &
FourStarMaxStats &
FiveStarMaxStats &
SixStarMaxStats;