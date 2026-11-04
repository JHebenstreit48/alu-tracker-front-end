import type { PageSize } from '@/utils/Cars/Filters/pagination';

export interface PageSizeProps {
  carsPerPage: PageSize;
  onPageSizeChange: (size: PageSize) => void;
}