import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { generateCarKey } from "@/components/CarInformation/CarDetails/Miscellaneous/StorageUtils";


import Header from "@/components/Shared/Header";
import PageTab from "@/components/Shared/PageTab";
import ClassTables from "@/components/CarInformation/CarList/ClassTables";
import CarFilters from "@/components/CarInformation/CarList/CarFilters";
import CarTrackerToggle from "@/components/CarInformation/CarDetails/OtherComponents/CarTrackerToggle";
import Navigation from "@/components/Shared/Navigation";

import "@/SCSS/Cars/CarsPage/Cars.scss";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "https://alutracker-api.onrender.com";

interface Car {
  _id: string;
  Brand: string;
  Model: string;
  Stars: number;
  KeyCar?: boolean;
}

interface CarTrackingData {
  owned?: boolean;
  stars?: number;
  goldMax?: boolean;
  keyObtained?: boolean;
  upgradeStage?: number;
  importParts?: number;
}

function normalizeString(str: string): string {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
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
  const [unitPreference, setUnitPreference] = useState<"metric" | "imperial">(
    () =>
      localStorage.getItem("preferredUnit") === "imperial"
        ? "imperial"
        : "metric"
  );

  const [showOwned, setShowOwned] = useState(false);
  const [showKeyCars, setShowKeyCars] = useState(false);

  const [trackerMode, setTrackerMode] = useState<boolean>(false);

  useEffect(() => {
    const saved = localStorage.getItem("trackerMode");
    const initial = saved === "true";
    console.log("📦 Loaded trackerMode from localStorage:", initial);
    setTrackerMode(initial);
  }, []);

  const toggleTrackerMode = (value: boolean) => {
    setTrackerMode(value);
    localStorage.setItem("trackerMode", String(value));
    console.log("💾 TrackerMode updated:", value);
  };

  const [carsPerPage, setCarsPerPage] = useState(25);
  const [currentPage, setCurrentPage] = useState(1);

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
  };

  const handleStarFilter = (stars: number | null) => {
    setSelectedStars(stars);
    setCurrentPage(1);
  };

  const handleClassChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newClass = e.target.value;
    setSelectedClass(newClass);
    sessionStorage.setItem("selectedClass", newClass);
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedStars(null);
    setSelectedClass("All Classes");
    setShowOwned(false);
    setShowKeyCars(false);
    localStorage.removeItem("searchTerm");
    sessionStorage.removeItem("selectedClass");
    setCurrentPage(1);
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
    setCurrentPage(1);
  };

  const getLocalTracking = (): Record<string, CarTrackingData> => {
    const tracked: Record<string, CarTrackingData> = {};
    for (const key in localStorage) {
      if (key.startsWith("car-tracker-")) {
        try {
          const carId = key.replace("car-tracker-", "");
          const item = localStorage.getItem(key);
          if (item) {
            tracked[carId] = JSON.parse(item) as CarTrackingData;
          }
        } catch (err) {
          console.warn(`Error parsing ${key}:`, err);
        }
      }
    }
    return tracked;
  };

  const tracking = getLocalTracking();
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
    .filter((car) => !showKeyCars || car.KeyCar)
    .filter((car) => {
      if (!showOwned) return true;
      const key = generateCarKey(car.Brand, car.Model);
      const isOwned = tracking[key]?.owned;
      return isOwned === true;
    })
    
    
    

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
          onToggleOwned={() => {
            setShowOwned(!showOwned);
            setCurrentPage(1);
          }}
          onToggleKeyCars={() => {
            setShowKeyCars(!showKeyCars);
            setCurrentPage(1);
          }}
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
