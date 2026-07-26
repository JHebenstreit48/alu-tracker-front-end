import type { Brand } from '@/types/Brands';

interface FilterBrandsOptions {
  country?: string;
  letter?: string;
  search?: string;
}

export function filterBrands(
  manufacturers: Brand[],
  { country, letter, search }: FilterBrandsOptions
): Brand[] {
  return manufacturers.filter((manufacturer) => {
    const matchesCountry =
      !country || country === 'All countries' || manufacturer.country.includes(country);

    const matchesLetter =
      !letter || manufacturer.brand.charAt(0).toUpperCase() === letter.toUpperCase();

    const matchesSearch =
      !search || manufacturer.brand.toLowerCase().includes(search.trim().toLowerCase());

    return matchesCountry && matchesLetter && matchesSearch;
  });
}