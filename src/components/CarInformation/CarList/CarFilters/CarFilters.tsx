import { CarFiltersProps } from "@/components/CarInformation/CarList/CarFilters/interfaces";
import Dropdowns from "@/components/CarInformation/CarList/CarFilters/Components/Dropdowns";
import Checkboxes from "@/components/CarInformation/CarList/CarFilters/Components/Checkboxes";
import SearchBar from "@/components/CarInformation/CarList/CarFilters/Components/SearchBar";

import "@/scss/Cars/CarsPage/index.scss";

export default function CarFilters({
  onSearch,
  onStarsChange,
  onClassChange,
  onUnitChange,
  onRarityChange,
  onBrandChange,
  onCountryChange,
  onReset,
  selectedStars,
  selectedClass,
  unitPreference,
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

      {/* Dropdowns appear in rows */}
      <Dropdowns
        onStarsChange={onStarsChange}
        onClassChange={onClassChange}
        onUnitChange={onUnitChange}
        onRarityChange={onRarityChange}
        onBrandChange={onBrandChange}
        onCountryChange={onCountryChange}
        selectedStars={selectedStars}
        selectedClass={selectedClass}
        unitPreference={unitPreference}
        selectedRarity={selectedRarity}
        selectedBrand={selectedBrand}
        selectedCountry={selectedCountry}
        availableStars={availableStars}
        availableBrands={availableBrands}
        availableCountries={availableCountries}
      />

      {/* Search centered on its own row */}
        <SearchBar searchTerm={searchTerm} onSearch={onSearch} />

      {/* Owned & Key Car checkboxes */}
      <Checkboxes
        showOwned={showOwned}
        showKeyCars={showKeyCars}
        onToggleOwned={onToggleOwned}
        onToggleKeyCars={onToggleKeyCars}
      />

      {/* Reset button row */}
        <button className="resetButton" onClick={onReset}>
          Reset Filters
        </button>
        
    </div>
  );
}
