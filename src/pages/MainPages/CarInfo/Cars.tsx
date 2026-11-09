import { useState, useEffect, useMemo } from 'react';
import CarData from '@/components/Cars/PageBody';
import {
  FilteredCarsProvider,
  useFilteredCarsContext,
  setLocalFilteredCars,
} from '@/context/Cars/filteredCarsContext';

import { useCarAPI, useCarFilters, useCarHandlers, useCarPagination } from '@/hooks/Cars';
import { useObtainMethodFilters } from '@/hooks/Cars/useObtainMethodFilters';
import { useTrackerMode } from '@/hooks/shared/useTrackerMode';
import { getAllCarTrackingData } from '@/utils/shared/StorageUtils';
import { matchesObtainMethod } from '@/utils/Cars/Filters/matchObtainMethod';

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

  const filteredCars = useMemo(
    () => attributeFilteredCars.filter((car) => matchesObtainMethod(car, obtainMethod.values)),
    [attributeFilteredCars, obtainMethod.values]
  );

  const { setFilteredCars } = useFilteredCarsContext();

  const filteredCarsKey = JSON.stringify(filteredCars.map((c) => c.normalizedKey));

  useEffect(() => {
    setFilteredCars(filteredCars);
    setLocalFilteredCars(filteredCars);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredCarsKey]);

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

  const {
    paginatedCars,
    carsPerPage,
    currentPage,
    totalPages,
    totalFiltered,
    rangeStart,
    rangeEnd,
    handlePageSizeChange,
    handlePageChange,
  } = useCarPagination(filteredCars, filtersKey);

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

  const resetAllFilters = () => {
    handleResetFilters();
    obtainMethod.reset();
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
        carsPerPage,
        onSearch: handleSearch,
        onStarsChange: handleStarFilter,
        onClassChange: handleClassChange,
        onRarityChange: handleRarityChange,
        onBrandChange: handleBrandChange,
        onCountryChange: handleCountryChange,
        onPageSizeChange: handlePageSizeChange,
        onToggleOwned: toggleOwned,
        onToggleKeyCars: toggleKeyCars,
        onReset: resetAllFilters,
      }}
      obtainMethodProps={{
        cars,
        values: obtainMethod.values,
        onChange: obtainMethod.setValue,
        onReset: obtainMethod.reset,
      }}
      cars={paginatedCars}
      selectedClass={selectedClass}
      pagination={{
        currentPage,
        totalPages,
        totalFiltered,
        rangeStart,
        rangeEnd,
        onPageChange: handlePageChange,
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