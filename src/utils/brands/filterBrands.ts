import type { Brand } from '@/types/Brands';

interface FilterBrandsOptions {
  country?: string;
  search?: string;
}

export function filterBrands(
  manufacturers: Brand[],
  { country, search }: FilterBrandsOptions
): Brand[] {
  return manufacturers.filter((manufacturer) => {
    const matchesCountry =
      !country || country === 'All countries' || manufacturer.country.includes(country);

    const matchesSearch =
      !search || manufacturer.brand.toLowerCase().includes(search.trim().toLowerCase());

    return matchesCountry && matchesSearch;
  });
}