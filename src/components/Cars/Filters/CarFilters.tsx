import { CarFiltersProps } from "@/types/Cars/Filters/CarFiltersProps";
import Dropdowns from "@/components/Cars/Filters/Dropdowns";
import Checkboxes from "@/components/Cars/Filters/Checkboxes";
import SearchBar from "@/components/Cars/Filters/SearchBar";

import "@/scss/cars/index.scss";

export default function CarFilters({
  onSearch,
  onStarsChange,
  onClassChange,
  onRarityChange,
  onBrandChange,
  onCountryChange,
  onReset,
  selectedStars,
  selectedClass,
  selectedRarity,
  selectedBrand,
  selectedCountry,
  availableStars,
  availableBrands,
  availableCountries,
  showOwned,
  showKeyCars,
  onToggleOwned,
  onToggleKeyCars,
  searchTerm,
}: CarFiltersProps) {
  return (
    <div className="carFilters">
      <div className="filterHeading">Car Filters</div>

      <Dropdowns
        onStarsChange={onStarsChange}
        onClassChange={onClassChange}
        onRarityChange={onRarityChange}
        onBrandChange={onBrandChange}
        onCountryChange={onCountryChange}
        selectedStars={selectedStars}
        selectedClass={selectedClass}
        selectedRarity={selectedRarity}
        selectedBrand={selectedBrand}
        selectedCountry={selectedCountry}
        availableStars={availableStars}
        availableBrands={availableBrands}
        availableCountries={availableCountries}
      />

      <SearchBar searchTerm={searchTerm} onSearch={onSearch} />

      <Checkboxes
        showOwned={showOwned}
        showKeyCars={showKeyCars}
        onToggleOwned={onToggleOwned}
        onToggleKeyCars={onToggleKeyCars}
      />

      <button className="resetButton" onClick={onReset}>
        Reset Filters
      </button>
    </div>
  );
}