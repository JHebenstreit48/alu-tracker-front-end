import { useMemo } from "react";
import { Car } from "@/types/shared/car";
import { CarTracking } from "@/types/shared/tracking"
import { useFilteredCars } from "@/components/Cars/CarFilters/Utilities/useFilteredCars";

interface UseCarFiltersProps {
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

export function useCarFilters({
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
}: UseCarFiltersProps) {
  const filteredCars = useFilteredCars({
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
  });

  const brandsByCountryMap = useMemo(() => {
    const map: Record<string, Set<string>> = {};

    cars.forEach((car) => {
      const country = car.country?.trim();
      const brand = car.brand;
      if (!country || !brand) return;

      if (!map[country]) {
        map[country] = new Set();
      }

      map[country].add(brand);
    });

    return map;
  }, [cars]);

  const availableCountries = useMemo(() => {
    return [...new Set(cars.map((car) => (car.country ?? "").trim()).filter((val) => val !== ""))];
  }, [cars]);

  const filteredBrands =
    selectedCountry && brandsByCountryMap[selectedCountry]
      ? Array.from(brandsByCountryMap[selectedCountry])
      : [...new Set(cars.map((car) => car.brand))];

  return {
    filteredCars,
    filteredBrands,
    availableCountries,
  };
}