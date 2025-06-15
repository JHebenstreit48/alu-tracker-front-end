import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import Header from "@/components/Shared/Header";
import PageTab from "@/components/Shared/PageTab";
import Navigation from "@/components/Shared/Navigation";
import CarFilters from "@/components/CarInformation/CarList/CarFilters/CarFilters";
import ClassTables from "@/components/CarInformation/CarList/ClassTables/ClassTables";
import CarTrackerToggle from "@/components/CarInformation/CarList/TrackerButtons/CarTrackerToggle";

import { getAllCarTrackingData } from "@/components/CarInformation/CarDetails/Miscellaneous/StorageUtils";
import { useFilteredCars } from "@/components/CarInformation/CarList/CarFilters/Utilities/useFilteredCars";
import { Car, CarTrackingData } from "@/components/CarInformation/CarList/CarFilters/types/CarTypes";

import "@/scss/Cars/CarsPage/index.scss";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "https://alutracker-api.onrender.com";

export default function Cars() {
  const navigate = useNavigate();

  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState(localStorage.getItem("searchTerm") || "");
  const [selectedStars, setSelectedStars] = useState<number | null>(null);
  const [selectedBrand, setSelectedBrand] = useState(localStorage.getItem("selectedBrand") || "");
  const [selectedCountry, setSelectedCountry] = useState(localStorage.getItem("selectedCountry") || "");
  const [selectedClass, setSelectedClass] = useState(sessionStorage.getItem("selectedClass") || "All Classes");
  const [selectedRarity, setSelectedRarity] = useState<string | null>(
    () => localStorage.getItem("selectedRarity") || null
  );
  const [unitPreference, setUnitPreference] = useState<"metric" | "imperial">(
    () => (localStorage.getItem("preferredUnit") === "imperial" ? "imperial" : "metric")
  );
  const [showOwned, setShowOwned] = useState(() => localStorage.getItem("showOwned") === "true");
  const [showKeyCars, setShowKeyCars] = useState(() => localStorage.getItem("showKeyCars") === "true");
  const [trackerMode, setTrackerMode] = useState(false);

  const [carsPerPage, setCarsPerPage] = useState(() => {
    const saved = localStorage.getItem("carsPerPage");
    return saved ? parseInt(saved, 10) : 25;
  });

  const [currentPage, setCurrentPage] = useState(() => {
    const saved = localStorage.getItem("currentPage");
    return saved ? parseInt(saved, 10) : 1;
  });

  useEffect(() => {
    const saved = localStorage.getItem("trackerMode");
    setTrackerMode(saved === "true");
  }, []);

  const toggleTrackerMode = (value: boolean) => {
    setTrackerMode(value);
    localStorage.setItem("trackerMode", String(value));
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    localStorage.setItem("searchTerm", term);
    setCurrentPage(1);
    localStorage.setItem("currentPage", "1");
  };

  const handleStarFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedStars(value ? parseInt(value, 10) : null);
    setCurrentPage(1);
    localStorage.setItem("currentPage", "1");
  };

  const handleClassChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newClass = e.target.value;
    setSelectedClass(newClass);
    sessionStorage.setItem("selectedClass", newClass);
    setCurrentPage(1);
    localStorage.setItem("currentPage", "1");
  };

  const handleRarityChange = (rarity: string | null) => {
    setSelectedRarity(rarity);
    if (rarity) {
      localStorage.setItem("selectedRarity", rarity);
    } else {
      localStorage.removeItem("selectedRarity");
    }
    setCurrentPage(1);
    localStorage.setItem("currentPage", "1");
  };

  const handleBrandChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setSelectedBrand(val);
    localStorage.setItem("selectedBrand", val);
    setCurrentPage(1);
    localStorage.setItem("currentPage", "1");
  };

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setSelectedCountry(val);
    localStorage.setItem("selectedCountry", val);

    // Reset brand when switching countries
    setSelectedBrand("");
    localStorage.setItem("selectedBrand", "");

    setCurrentPage(1);
    localStorage.setItem("currentPage", "1");
  };

  const handleUnitPreferenceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newUnit = e.target.value as "metric" | "imperial";
    setUnitPreference(newUnit);
    localStorage.setItem("preferredUnit", newUnit);
  };

  const toggleShowOwned = () => {
    const newVal = !showOwned;
    setShowOwned(newVal);
    localStorage.setItem("showOwned", String(newVal));
  };

  const toggleShowKeyCars = () => {
    const newVal = !showKeyCars;
    setShowKeyCars(newVal);
    localStorage.setItem("showKeyCars", String(newVal));
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedStars(null);
    setSelectedBrand("");
    setSelectedCountry("");
    setSelectedClass("All Classes");
    setSelectedRarity(null);
    setShowOwned(false);
    setShowKeyCars(false);
    setCarsPerPage(25);
    setCurrentPage(1);

    localStorage.removeItem("searchTerm");
    localStorage.removeItem("selectedBrand");
    localStorage.removeItem("selectedCountry");
    localStorage.removeItem("selectedRarity");
    localStorage.removeItem("showOwned");
    localStorage.removeItem("showKeyCars");
    sessionStorage.removeItem("selectedClass");
    localStorage.setItem("carsPerPage", "25");
    localStorage.setItem("currentPage", "1");
  };

  const handlePageSizeChange = (size: number) => {
    setCarsPerPage(size);
    localStorage.setItem("carsPerPage", String(size));
    setCurrentPage(1);
    localStorage.setItem("currentPage", "1");
  };

  const loadCars = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        limit: "1000",
        offset: "0",
        ...(selectedClass !== "All Classes" && { class: selectedClass }),
      });

      const response = await fetch(`${API_BASE_URL}/api/cars?${params.toString()}`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const result = await response.json();
      setCars(Array.isArray(result.cars) ? result.cars : []);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch cars. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [selectedClass]);

  useEffect(() => {
    loadCars();
  }, [loadCars]);

  const tracking: Record<string, CarTrackingData> = getAllCarTrackingData();

  const filteredCars = useFilteredCars({
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

  const brandsByCountryMap = useMemo(() => {
    const map: Record<string, Set<string>> = {};

    cars.forEach((car) => {
      const country = car.Country?.trim();
      const brand = car.Brand;

      if (!country || !brand) return;

      if (!map[country]) {
        map[country] = new Set();
      }

      map[country].add(brand);
    });

    return map;
  }, [cars]);

  const filteredBrands =
    selectedCountry && brandsByCountryMap[selectedCountry]
      ? Array.from(brandsByCountryMap[selectedCountry])
      : [...new Set(cars.map((car) => car.Brand))];

  const totalFiltered = filteredCars.length;
  const paginatedCars = filteredCars.slice(
    (currentPage - 1) * carsPerPage,
    currentPage * carsPerPage
  );

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
    <div className="cars">
      <PageTab title="Cars">
        <Header text="Cars" className="carsHeader" />
        <Navigation />

        <div className="trackerControlsRow">
          <CarTrackerToggle isEnabled={trackerMode} onToggle={toggleTrackerMode} />
          <div className="trackerSummaryLink">
            <button className="trackerSummary" onClick={() => navigate("/car-tracker")}>
              Account Progress
            </button>
          </div>
        </div>

        <CarFilters
          onSearch={handleSearch}
          onStarsChange={handleStarFilter}
          onClassChange={handleClassChange}
          onUnitChange={handleUnitPreferenceChange}
          onReset={handleResetFilters}
          selectedClass={selectedClass}
          unitPreference={unitPreference}
          showOwned={showOwned}
          showKeyCars={showKeyCars}
          onToggleOwned={toggleShowOwned}
          onToggleKeyCars={toggleShowKeyCars}
          searchTerm={searchTerm}
          selectedRarity={selectedRarity}
          onRarityChange={handleRarityChange}
          selectedStars={selectedStars}
          selectedBrand={selectedBrand}
          selectedCountry={selectedCountry}
          onBrandChange={handleBrandChange}
          onCountryChange={handleCountryChange}
          availableStars={[3, 4, 5, 6]}
          availableBrands={filteredBrands}
          availableCountries={[
            ...new Set(
              cars
                .map((car) => (car.Country ?? "").trim())
                .filter((val) => val !== "")
            )
          ]}
        />

        <p className="carCount">
          Showing {paginatedCars.length} of {totalFiltered} car{totalFiltered !== 1 ? "s" : ""}
        </p>

        <ClassTables
          cars={paginatedCars}
          selectedClass={selectedClass}
          loading={loading}
          trackerMode={trackerMode}
        />

        <div className="pageSizeControl">
          <span className="paginationLabel">Cars per page:</span>
          {[25, 50, 100, 200, 300].map((size) => (
            <button
              key={size}
              onClick={() => handlePageSizeChange(size)}
              disabled={carsPerPage === size}
              className="carsPerPage"
            >
              {size}
            </button>
          ))}
        </div>
      </PageTab>
    </div>
  );
}
