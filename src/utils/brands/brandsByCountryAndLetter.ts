import type { Brand, GroupedBrands } from '@/types/Brands';

export function groupBrandsByCountryAndLetter(manufacturers: Brand[]): GroupedBrands {
  const groupedByCountry = manufacturers.reduce((acc: GroupedBrands, manufacturer) => {
    const countries =
      manufacturer.country && manufacturer.country.length > 0
        ? manufacturer.country
        : ['Unknown'];

    countries.forEach((country) => {
      if (!acc[country]) acc[country] = {};

      const firstLetter = manufacturer.brand.charAt(0).toUpperCase();
      if (!acc[country][firstLetter]) acc[country][firstLetter] = [];

      acc[country][firstLetter].push(manufacturer);
    });

    return acc;
  }, {});

  Object.keys(groupedByCountry).forEach((country) => {
    Object.keys(groupedByCountry[country]).forEach((letter) => {
      groupedByCountry[country][letter].sort((a, b) => a.brand.localeCompare(b.brand));
    });
  });

  return groupedByCountry;
}