import type { Car } from '@/types/shared/car';

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
  onSearch: (term: string) => void;
  onStarsChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onClassChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onRarityChange: (rarity: string | null) => void;
  onBrandChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onCountryChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onToggleOwned: () => void;
  onToggleKeyCars: () => void;
  onReset: () => void;
}

export interface CarDataProps {
  loading: boolean;
  trackerMode: boolean;
  error?: string | null;

  filterProps: CarFilterProps;

  cars: Car[];
  selectedClass: string;

  carsPerPage: number;
  handlePageSizeChange: (size: number) => void;
  totalFiltered: number;
}