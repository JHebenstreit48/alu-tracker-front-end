import { Car } from "@/types/shared/car";
import { CarTracking } from "@/types/shared/tracking"
import { normalizeString, generateCarKey } from "@/utils/shared/StorageUtils";

interface FilterConfig {
  cars: Car[];
  tracking: Record<string, CarTracking>;
  searchTerm: string;
  selectedStars: number | null;
  selectedBrand: string;
  selectedCountry: string;
  selectedClass: string;
  selectedRarity: string | null;
  showOwned: boolean;
  showKeyCars: boolean;
}

export function useFilteredCars(config: FilterConfig): Car[] {
  const {
    cars,
    tracking,
    searchTerm,
    selectedStars,
    selectedBrand,
    selectedCountry,
    selectedClass,
    selectedRarity,
    showOwned,
    showKeyCars,
  } = config;

  const normalizedSearch = normalizeString(searchTerm);

  return cars
    .filter((car) => {
      const brand = normalizeString(car.brand);
      const model = normalizeString(car.model);
      return brand.includes(normalizedSearch) || model.includes(normalizedSearch);
    })
    .filter((car) => (selectedStars ? car.stars === selectedStars : true))
    .filter((car) => (selectedBrand ? car.brand === selectedBrand : true))
    .filter((car) => (selectedCountry ? car.country === selectedCountry : true))
    .filter((car) => (selectedClass !== "All Classes" ? car.class === selectedClass : true))
    .filter((car) => (selectedRarity ? car.rarity === selectedRarity : true))
    .filter((car) => {
      const key = generateCarKey(car.brand, car.model);
      const trackingData = tracking[key];
      const isOwned = trackingData?.owned === true;
      const isKeyCar = car.keyCar === true;

      if (showOwned && showKeyCars) return isOwned && isKeyCar;
      if (showOwned) return isOwned;
      if (showKeyCars) return isKeyCar;
      return true;
    });
}
