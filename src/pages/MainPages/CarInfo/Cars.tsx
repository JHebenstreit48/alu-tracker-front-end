import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  generateCarKey,
  getAllCarTrackingData,
  normalizeString,
  CarTrackingData,
} from "@/components/CarInformation/CarDetails/Miscellaneous/StorageUtils";

import Header from "@/components/Shared/Header";
import PageTab from "@/components/Shared/PageTab";
import ClassTables from "@/components/CarInformation/CarList/ClassTables";
import CarFilters from "@/components/CarInformation/CarList/CarFilters";
import CarTrackerToggle from "@/components/CarInformation/CarList/CarTrackerToggle";
import Navigation from "@/components/Shared/Navigation";

import "@/SCSS/Cars/CarsPage/index.scss";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "https://alutracker-api.onrender.com";

interface Car {
  Brand: string;
  Model: string;
  Class: string;
  Stars: number;
  KeyCar?: boolean;
  Rarity: string; // ✅ Ensures rarity is available for filtering
}

export default function Cars() {
  const navigate = useNavigate();
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState(
    localStorage.getItem("searchTerm") || ""
  );
  const [selectedStars, setSelectedStars] = useState<number | null>(null);
  const [selectedClass, setSelectedClass] = useState(
    sessionStorage.getItem("selectedClass") || "All Classes"
  );
  const [selectedRarity, setSelectedRarity] = useState<string | null>(
    () => localStorage.getItem("selectedRarity") || null
  );
  const [unitPreference, setUnitPreference] = useState<"metric" | "imperial">(
    () =>
      localStorage.getItem("preferredUnit") === "imperial"
        ? "imperial"
        : "metric"
  );

  const [showOwned, setShowOwned] = useState(
    () => localStorage.getItem("showOwned") === "true"
  );
  const [showKeyCars, setShowKeyCars] = useState(
    () => localStorage.getItem("showKeyCars") === "true"
  );
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
    const initial = saved === "true";
    setTrackerMode(initial);
  }, []);

  const toggleTrackerMode = (value: boolean) => {
    setTrackerMode(value);
    localStorage.setItem("trackerMode", String(value));
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

      const response = await fetch(
        `${API_BASE_URL}/api/cars?${params.toString()}`
      );
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
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

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    localStorage.setItem("searchTerm", term);
    setCurrentPage(1);
    localStorage.setItem("currentPage", "1");
  };

  const handleStarFilter = (stars: number | null) => {
    setSelectedStars(stars);
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

  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedStars(null);
    setSelectedClass("All Classes");
    setSelectedRarity(null);
    setShowOwned(false);
    setShowKeyCars(false);
    setCarsPerPage(25);
    setCurrentPage(1);

    localStorage.removeItem("searchTerm");
    sessionStorage.removeItem("selectedClass");
    localStorage.removeItem("selectedRarity");
    localStorage.removeItem("showOwned");
    localStorage.removeItem("showKeyCars");
    localStorage.setItem("carsPerPage", "25");
    localStorage.setItem("currentPage", "1");
  };

  const handleUnitPreferenceChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newUnit = e.target.value as "metric" | "imperial";
    setUnitPreference(newUnit);
    localStorage.setItem("preferredUnit", newUnit);
  };

  const handlePageSizeChange = (size: number) => {
    setCarsPerPage(size);
    localStorage.setItem("carsPerPage", String(size));
    setCurrentPage(1);
    localStorage.setItem("currentPage", "1");
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

  const tracking: Record<string, CarTrackingData> = getAllCarTrackingData();
  const normalizedSearch = normalizeString(searchTerm);

  const filteredCars = cars
    .filter((car) => {
      const brand = normalizeString(car.Brand);
      const model = normalizeString(car.Model);
      return (
        brand.includes(normalizedSearch) || model.includes(normalizedSearch)
      );
    })
    .filter((car) => (selectedStars ? car.Stars === selectedStars : true))
    .filter((car) => {
      const key = generateCarKey(car.Brand, car.Model);
      const trackingData = tracking[key];
      const isOwned = trackingData?.owned === true;
      const isKeyCar = car.KeyCar === true;

      if (showOwned && showKeyCars) return isOwned && isKeyCar;
      if (showOwned) return isOwned;
      if (showKeyCars) return isKeyCar;
      return true;
    })
    .filter((car) => {
      if (!selectedRarity) return true;
      return car.Rarity === selectedRarity;
    });

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
          <CarTrackerToggle
            isEnabled={trackerMode}
            onToggle={toggleTrackerMode}
          />
          <div className="trackerSummaryLink">
            <button
              className="trackerSummary"
              onClick={() => navigate("/car-tracker")}
            >
              My Car Tracker Summary
            </button>
          </div>
        </div>

        <CarFilters
          onSearch={handleSearch}
          onFilter={handleStarFilter}
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
        />

        <p className="car-count">
          Showing {paginatedCars.length} of {totalFiltered} car
          {totalFiltered !== 1 ? "s" : ""}
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
