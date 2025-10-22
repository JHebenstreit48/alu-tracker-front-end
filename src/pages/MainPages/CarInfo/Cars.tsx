import { useState } from "react";
import Header from "@/components/Shared/HeaderFooter/Header";
import PageTab from "@/components/Shared/Navigation/PageTab";
import CarData from "@/components/CarInformation/CarList/PageBody";

import {
  useCarAPI,
  useCarFilters,
  useCarHandlers,
  useCarPagination,
} from "@/components/CarInformation/CarList/Utilities/CarDataFetch";
import { useTrackerMode } from "@/components/CarInformation/shared/useTrackerMode";

import { getAllCarTrackingData } from "@/components/CarInformation/CarDetails/Miscellaneous/StorageUtils";

export default function Cars() {
  const {
    searchTerm,
    selectedStars,
    selectedBrand,
    selectedCountry,
    selectedClass,
    selectedRarity,
    carsPerPage,
    handleSearch,
    handleStarFilter,
    handleClassChange,
    handleRarityChange,
    handleBrandChange,
    handleCountryChange,
    handleResetFilters,
  } = useCarHandlers();

  // removed unitPreference state

  const [showOwned, setShowOwned] = useState(localStorage.getItem("showOwned") === "true");
  const [showKeyCars, setShowKeyCars] = useState(localStorage.getItem("showKeyCars") === "true");

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

  const { paginatedCars, totalFiltered, handlePageSizeChange } = useCarPagination(filteredCars);

  const toggleOwned = () => {
    const next = !showOwned;
    setShowOwned(next);
    localStorage.setItem("showOwned", String(next));
  };

  const toggleKeyCars = () => {
    const next = !showKeyCars;
    setShowKeyCars(next);
    localStorage.setItem("showKeyCars", String(next));
  };

  if (error) {
    return (
      <div className="cars">
        <PageTab title="Cars">
          <Header text="Cars" />
          <div className="error-message">{error}</div>
        </PageTab>
      </div>
    );
  }

  return (
    <CarData
      loading={loading}
      trackerMode={trackerMode}
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