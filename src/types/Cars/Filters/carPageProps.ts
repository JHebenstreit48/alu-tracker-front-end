import type { Car } from '@/types/shared/car';
import type { PageSize } from '@/utils/Cars/Filters/pagination';

export interface CarFilterProps {
  searchTerm: string;
  selectedStars: number | null;
  selectedBrand: string;
  selectedCountry: string;
  selectedClass: string;
  selectedRarity: string | null;
  showOwned: boolean;
  showKeyCars: boolean;
  availableBrands: string[];
  availableCountries: string[];
  carsPerPage: PageSize;
  onSearch: (term: string) => void;
  onStarsChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onClassChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onRarityChange: (rarity: string | null) => void;
  onBrandChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onCountryChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onPageSizeChange: (size: PageSize) => void;
  onToggleOwned: () => void;
  onToggleKeyCars: () => void;
  onReset: () => void;
}

export interface CarPaginationProps {
  currentPage: number;
  totalPages: number;
  totalFiltered: number;
  rangeStart: number;
  rangeEnd: number;
  onPageChange: (page: number) => void;
}

export interface CarDataProps {
  loading: boolean;
  trackerMode: boolean;
  error?: string | null;
  filterProps: CarFilterProps;
  cars: Car[];
  selectedClass: string;
  pagination: CarPaginationProps;
}