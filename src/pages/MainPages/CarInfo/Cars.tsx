import { useState } from "react";
import Header from "@/components/Shared/Header";
import PageTab from "@/components/Shared/PageTab";
import CarData from "@/components/CarInformation/CarList/PageBody";

import {
  useCarAPI,
  useCarFilters,
  useCarHandlers,
  useCarPagination,
  useTrackerToggle,
} from "@/components/CarInformation/CarList/Utilities/CarDataFetch";

import { getAllCarTrackingData } from "@/components/CarInformation/CarDetails/Miscellaneous/StorageUtils";

export default function Cars() {
  // 📦 Core filter + pagination state
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

  const [unitPreference, setUnitPreference] = useState<"metric" | "imperial">(
    localStorage.getItem("preferredUnit") === "imperial" ? "imperial" : "metric"
  );

  const [showOwned, setShowOwned] = useState(localStorage.getItem("showOwned") === "true");
  const [showKeyCars, setShowKeyCars] = useState(localStorage.getItem("showKeyCars") === "true");

  // 🧠 Tracker toggle
  const { trackerMode, toggleTrackerMode } = useTrackerToggle();

  // 🚗 Fetch cars + tracking
  const tracking = getAllCarTrackingData();
  const { cars, loading, error } = useCarAPI(selectedClass);

  // 🧹 Filter & paginate
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

  const {
    paginatedCars,
    totalFiltered,
    handlePageSizeChange,
  } = useCarPagination(filteredCars);

  // ✅ Toggles
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
      toggleTrackerMode={toggleTrackerMode}
      filterProps={{
        searchTerm,
        selectedStars,
        selectedBrand,
        selectedCountry,
        selectedClass,
        selectedRarity,
        unitPreference,
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
        onUnitChange: (e) => {
          const newVal = e.target.value as "metric" | "imperial";
          setUnitPreference(newVal);
          localStorage.setItem("preferredUnit", newVal);
        },
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