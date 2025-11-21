import { useMemo } from 'react';
import { DropdownsProps } from '@/components/Cars/CarFilters/interfaces/DropdownsProps';

const renderStars = (count: number) => '★'.repeat(count);

export default function Dropdowns({
  onStarsChange,
  onClassChange,
  onRarityChange,
  onBrandChange,
  onCountryChange,
  selectedStars,
  selectedClass,
  selectedRarity,
  selectedBrand,
  selectedCountry,
  availableStars,
  availableBrands,
  availableCountries,
}: DropdownsProps) {
  // 🔠 Defensive, stable sorting for brands
  const sortedBrands = useMemo(
    () =>
      [...availableBrands]
        .filter(Boolean)
        .map((b) => b.trim())
        .sort((a, b) =>
          a.localeCompare(b, undefined, {
            sensitivity: 'base', // ignore case / accents
          })
        ),
    [availableBrands]
  );

  // 🔠 Same idea for countries (optional but nice)
  const sortedCountries = useMemo(
    () =>
      [...availableCountries]
        .filter(Boolean)
        .map((c) => c.trim())
        .sort((a, b) =>
          a.localeCompare(b, undefined, {
            sensitivity: 'base',
          })
        ),
    [availableCountries]
  );

  return (
    <>
      <label className="DropdownLabel starFilter">
        Max Star Rank:
        <select
          className="starRanks"
          value={selectedStars ?? 'All'}
          onChange={onStarsChange}
        >
          <option value="All">All Stars</option>
          {availableStars.map((star) => (
            <option key={star} value={star}>
              {renderStars(star)}
            </option>
          ))}
        </select>
      </label>

      <label className="DropdownLabel classFilter">
        Class:
        <select
          className="classSelect"
          value={selectedClass}
          onChange={onClassChange}
        >
          <option value="All Classes">All Classes</option>
          {['D', 'C', 'B', 'A', 'S'].map((cls) => (
            <option key={cls} value={cls}>
              {cls}
            </option>
          ))}
        </select>
      </label>

      <label className="DropdownLabel rarityFilter">
        Rarity:
        <select
          value={selectedRarity || ''}
          onChange={(e) => onRarityChange(e.target.value || null)}
        >
          <option value="">All Rarities</option>
          {['Uncommon', 'Rare', 'Epic'].map((rarity) => (
            <option
              key={rarity}
              value={rarity}
              className={
                rarity === 'Uncommon'
                  ? 'optionUncommon'
                  : rarity === 'Rare'
                  ? 'optionRare'
                  : rarity === 'Epic'
                  ? 'optionEpic'
                  : ''
              }
            >
              {rarity}
            </option>
          ))}
        </select>
      </label>

      <label className="DropdownLabel brandFilter">
        Brand:
        <select
          className="scrollableDropdown"
          value={selectedBrand || ''}
          onChange={onBrandChange}
        >
          <option value="">All Brands</option>
          {sortedBrands.map((brand) => (
            <option key={brand} value={brand}>
              {brand}
            </option>
          ))}
        </select>
      </label>

      <label className="DropdownLabel countryFilter">
        Country:
        <select
          value={selectedCountry || ''}
          onChange={onCountryChange}
        >
          <option value="">All Countries</option>
          {sortedCountries.map((country) => (
            <option key={country} value={country}>
              {country}
            </option>
          ))}
        </select>
      </label>
    </>
  );
}