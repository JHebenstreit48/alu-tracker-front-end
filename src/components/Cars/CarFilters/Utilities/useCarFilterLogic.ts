import { useMemo } from "react";
import { Car } from "@/types/shared/car";

export function useCarFilterLogic(cars: Car[], selectedCountry: string) {
  const brandsByCountryMap = useMemo(() => {
    const map: Record<string, Set<string>> = {};
    cars.forEach((car) => {
      const country = car.Country?.trim();
      const brand = car.Brand;
      if (!country || !brand) return;
      if (!map[country]) map[country] = new Set();
      map[country].add(brand);
    });
    return map;
  }, [cars]);

  const filteredBrands = useMemo(() => {
    if (selectedCountry && brandsByCountryMap[selectedCountry]) {
      return Array.from(brandsByCountryMap[selectedCountry]);
    }
    return [...new Set(cars.map((car) => car.Brand))];
  }, [selectedCountry, brandsByCountryMap, cars]);

  const availableCountries = useMemo(() => {
    return [...new Set(cars.map((car) => car.Country?.trim()).filter(Boolean))];
  }, [cars]);

  return {
    filteredBrands,
    availableCountries,
  };
}