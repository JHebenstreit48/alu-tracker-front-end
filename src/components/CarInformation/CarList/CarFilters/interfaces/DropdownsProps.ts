export interface DropdownsProps {
  onStarsChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onClassChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onUnitChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onRarityChange: (rarity: string | null) => void;
  onBrandChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onCountryChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;

  selectedStars: number | null;
  selectedClass: string;
  unitPreference: "metric" | "imperial";
  selectedRarity: string | null;
  selectedBrand: string;
  selectedCountry: string;
  availableStars: number[];
  availableBrands: string[];
  availableCountries: string[];
}
