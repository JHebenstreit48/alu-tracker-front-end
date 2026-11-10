import CarData from '@/components/Cars/PageBody';
import { FilteredCarsProvider } from '@/context/Cars/filteredCarsContext';

import { useCarAPI, useCarFilters, useCarHandlers, useCarPagination } from '@/hooks/Cars';
import { useCarToggles } from '@/hooks/Cars/useCarToggles';
import { useObtainMethodFilters } from '@/hooks/Cars/useObtainMethodFilters';
import { useObtainFilteredCars } from '@/hooks/Cars/useObtainFilteredCars';
import { useTrackerMode } from '@/hooks/shared/useTrackerMode';
import { getAllCarTrackingData } from '@/utils/shared/StorageUtils';

function CarsInner() {
  const handlers = useCarHandlers();
  const { searchTerm, selectedStars, selectedBrand, selectedCountry, selectedClass, selectedRarity } =
    handlers;
  const { showOwned, showKeyCars, toggleOwned, toggleKeyCars } = useCarToggles();

  const { trackerMode } = useTrackerMode();
  const tracking = getAllCarTrackingData();
  const { cars, loading, error } = useCarAPI(selectedClass);
  const obtainMethod = useObtainMethodFilters();

  const { filteredCars: attributeFilteredCars, filteredBrands, availableCountries } = useCarFilters({
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

  const filteredCars = useObtainFilteredCars(attributeFilteredCars, obtainMethod.values);

  const filtersKey = JSON.stringify([
    searchTerm,
    selectedStars,
    selectedBrand,
    selectedCountry,
    selectedClass,
    selectedRarity,
    showOwned,
    showKeyCars,
    obtainMethod.values,
  ]);

  const pagination = useCarPagination(filteredCars, filtersKey);

  return (
    <CarData
      loading={loading}
      trackerMode={trackerMode}
      error={error}
      filterProps={{
        searchTerm,
        selectedStars,
        selectedBrand,
        selectedCountry,
        selectedClass,
        selectedRarity,
        showOwned,
        showKeyCars,
        availableBrands: filteredBrands,
        availableCountries,
        carsPerPage: pagination.carsPerPage,
        onSearch: handlers.handleSearch,
        onStarsChange: handlers.handleStarFilter,
        onClassChange: handlers.handleClassChange,
        onRarityChange: handlers.handleRarityChange,
        onBrandChange: handlers.handleBrandChange,
        onCountryChange: handlers.handleCountryChange,
        onPageSizeChange: pagination.handlePageSizeChange,
        onToggleOwned: toggleOwned,
        onToggleKeyCars: toggleKeyCars,
        onReset: handlers.handleResetFilters,
      }}
      obtainMethodProps={{
        cars,
        values: obtainMethod.values,
        onChange: obtainMethod.setValue,
        onReset: obtainMethod.reset,
      }}
      cars={pagination.paginatedCars}
      selectedClass={selectedClass}
      pagination={{
        currentPage: pagination.currentPage,
        totalPages: pagination.totalPages,
        totalFiltered: pagination.totalFiltered,
        rangeStart: pagination.rangeStart,
        rangeEnd: pagination.rangeEnd,
        onPageChange: pagination.handlePageChange,
      }}
    />
  );
}

export default function Cars() {
  return (
    <FilteredCarsProvider>
      <CarsInner />
    </FilteredCarsProvider>
  );
}