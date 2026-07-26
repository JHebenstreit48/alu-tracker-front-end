import type { Brand } from '@/types/Brands';

export function getAvailableCountries(manufacturers: Brand[]): string[] {
  const countries = new Set<string>();
  manufacturers.forEach((manufacturer) => {
    const list =
      manufacturer.country && manufacturer.country.length > 0
        ? manufacturer.country
        : ['Unknown'];
    list.forEach((country) => countries.add(country));
  });
  return Array.from(countries).sort();
}

export function getAvailableLetters(manufacturers: Brand[]): string[] {
  const letters = new Set<string>();
  manufacturers.forEach((manufacturer) => {
    letters.add(manufacturer.brand.charAt(0).toUpperCase());
  });
  return Array.from(letters).sort();
}