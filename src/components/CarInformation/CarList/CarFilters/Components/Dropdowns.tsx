import { DropdownsProps } from '@/components/CarInformation/CarList/CarFilters/interfaces/DropdownsProps';

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
  return (
    <>
      <label className="DropdownLabel starFilter">
        Star Rank:
        <select
          className="starRanks"
          value={selectedStars ?? 'All'}
          onChange={onStarsChange}
        >
          <option value="All">All Stars</option>
          {availableStars.map((star) => (
            <option
              key={star}
              value={star}
            >
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
            <option
              key={cls}
              value={cls}
            >
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
          {availableBrands.map((brand) => (
            <option
              key={brand}
              value={brand}
            >
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
          {availableCountries.map((country) => (
            <option
              key={country}
              value={country}
            >
              {country}
            </option>
          ))}
        </select>
      </label>
    </>
  );
}