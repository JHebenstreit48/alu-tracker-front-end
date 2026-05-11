import { useState, useEffect } from 'react';
import CarData from '@/components/Cars/PageBody';
import {
  FilteredCarsProvider,
  useFilteredCarsContext,
  setLocalFilteredCars,
} from '@/context/Cars/filteredCarsContext';

import { useCarAPI, useCarFilters, useCarHandlers, useCarPagination } from '@/hooks/Cars';
import { useTrackerMode } from '@/hooks/shared/useTrackerMode';
import { getAllCarTrackingData } from '@/utils/shared/StorageUtils';

function CarsInner() {
  const {
    searchTerm,
    selectedStars,
    selectedBrand,
    selectedCountry,
    selectedClass,
    selectedRarity,
    handleSearch,
    handleStarFilter,
    handleClassChange,
    handleRarityChange,
    handleBrandChange,
    handleCountryChange,
    handleResetFilters,
  } = useCarHandlers();

  const [showOwned, setShowOwned] = useState(localStorage.getItem('showOwned') === 'true');
  const [showKeyCars, setShowKeyCars] = useState(localStorage.getItem('showKeyCars') === 'true');

  const { trackerMode } = useTrackerMode();
  const tracking = getAllCarTrackingData();
  const { cars, loading, error } = useCarAPI(selectedClass);

  const { filteredCars, filteredBrands, availableCountries } = useCarFilters({
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

  const { setFilteredCars } = useFilteredCarsContext();

  useEffect(() => {
    setFilteredCars(filteredCars);
    setLocalFilteredCars(filteredCars);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredCars]);

  const { paginatedCars, totalFiltered, carsPerPage, handlePageSizeChange } =
    useCarPagination(filteredCars);

  const toggleOwned = () => {
    const next = !showOwned;
    setShowOwned(next);
    localStorage.setItem('showOwned', String(next));
  };

  const toggleKeyCars = () => {
    const next = !showKeyCars;
    setShowKeyCars(next);
    localStorage.setItem('showKeyCars', String(next));
  };

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
        onSearch: handleSearch,
        onStarsChange: handleStarFilter,
        onClassChange: handleClassChange,
        onRarityChange: handleRarityChange,
        onBrandChange: handleBrandChange,
        onCountryChange: handleCountryChange,
        onToggleOwned: toggleOwned,
        onToggleKeyCars: toggleKeyCars,
        onReset: handleResetFilters,
      }}
      cars={paginatedCars}
      selectedClass={selectedClass}
      carsPerPage={carsPerPage}
      handlePageSizeChange={handlePageSizeChange}
      totalFiltered={totalFiltered}
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