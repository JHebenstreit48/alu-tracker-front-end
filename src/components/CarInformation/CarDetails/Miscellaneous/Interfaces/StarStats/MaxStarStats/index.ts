import { OneStarMaxStats } from '@/components/CarInformation/CarDetails/Miscellaneous/Interfaces/StarStats/MaxStarStats/OneStarMaxStats';
import { TwoStarMaxStats } from '@/components/CarInformation/CarDetails/Miscellaneous/Interfaces/StarStats/MaxStarStats/TwoStarMaxStats';
import { ThreeStarMaxStats } from '@/components/CarInformation/CarDetails/Miscellaneous/Interfaces/StarStats/MaxStarStats/ThreeStarMaxStats';
import { FourStarMaxStats } from '@/components/CarInformation/CarDetails/Miscellaneous/Interfaces/StarStats/MaxStarStats/FourStarMaxStats';
import { FiveStarMaxStats } from '@/components/CarInformation/CarDetails/Miscellaneous/Interfaces/StarStats/MaxStarStats/FiveStarMaxStats';
import { SixStarMaxStats } from '@/components/CarInformation/CarDetails/Miscellaneous/Interfaces/StarStats/MaxStarStats/SixStarMaxStats';

export * from '@/components/CarInformation/CarDetails/Miscellaneous/Interfaces/StarStats/MaxStarStats/OneStarMaxStats';
export * from '@/components/CarInformation/CarDetails/Miscellaneous/Interfaces/StarStats/MaxStarStats/TwoStarMaxStats';
export * from '@/components/CarInformation/CarDetails/Miscellaneous/Interfaces/StarStats/MaxStarStats/ThreeStarMaxStats';
export * from '@/components/CarInformation/CarDetails/Miscellaneous/Interfaces/StarStats/MaxStarStats/FourStarMaxStats';
export * from '@/components/CarInformation/CarDetails/Miscellaneous/Interfaces/StarStats/MaxStarStats/FiveStarMaxStats';
export * from '@/components/CarInformation/CarDetails/Miscellaneous/Interfaces/StarStats/MaxStarStats/SixStarMaxStats';

export type MaxStarStats =
OneStarMaxStats &
TwoStarMaxStats &
ThreeStarMaxStats &
FourStarMaxStats &
FiveStarMaxStats &
SixStarMaxStats;