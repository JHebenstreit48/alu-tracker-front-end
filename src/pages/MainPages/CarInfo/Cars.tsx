import { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import Header from "@/components/Shared/Header";
import PageTab from "@/components/Shared/PageTab";
import ClassTables from "@/components/CarInformation/CarList/ClassTables";
import CarFilters from "@/components/CarInformation/CarList/CarFilters";
import CarTrackerToggle from "@/components/CarInformation/CarDetails/OtherComponents/CarTrackerToggle";
import "@/SCSS/Cars/CarsPage/Cars.scss";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "https://alutracker-api.onrender.com";

interface Car {
  _id: string;
  Brand: string;
  Model: string;
  Stars: number;
}

export default function Cars() {
  const location = useLocation();
  const navigate = useNavigate();
  const [cars, setCars] = useState<Car[]>([]);
  const [carsPerPage, setCarsPerPage] = useState(25);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [trackerMode, setTrackerMode] = useState<boolean>(() => {
    return localStorage.getItem("trackerMode") === "true";
  });

  useEffect(() => {
    const navTracker = location.state?.trackerMode;
    if (navTracker !== undefined) {
      setTrackerMode(navTracker);
      localStorage.setItem("trackerMode", String(navTracker));
    }
  }, [location.state]);

  const [searchTerm, setSearchTerm] = useState<string>(
    localStorage.getItem("searchTerm") || ""
  );
  const [selectedStars, setSelectedStars] = useState<number | null>(null);
  const [selectedClass, setSelectedClass] = useState<string>(
    sessionStorage.getItem("selectedClass") || "All Classes"
  );
  const [unitPreference, setUnitPreference] = useState<"metric" | "imperial">(
    () => {
      const savedUnit = localStorage.getItem("preferredUnit");
      return savedUnit === "imperial" || savedUnit === "metric"
        ? savedUnit
        : "metric";
    }
  );

  const loadCars = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        limit: carsPerPage.toString(),
        offset: "0",
        ...(selectedClass !== "All Classes" && { class: selectedClass }),
        ...(searchTerm && { search: searchTerm }), // ✅ Search term included
      });

      const response = await fetch(
        `${API_BASE_URL}/api/cars?${params.toString()}`
      );
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);

      const result = await response.json();

      setCars(Array.isArray(result.cars) ? result.cars : []);
      setTotalCount(typeof result.total === "number" ? result.total : 0);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch cars. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [selectedClass, carsPerPage, searchTerm]); // ✅ Track searchTerm too

  useEffect(() => {
    loadCars();
  }, [selectedClass, location.state, loadCars, carsPerPage]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    localStorage.setItem("searchTerm", term);
  };

  const handleStarFilter = (stars: number | null) => {
    setSelectedStars(stars);
  };

  const handleClassChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newClass = e.target.value;
    setSelectedClass(newClass);
    sessionStorage.setItem("selectedClass", newClass);
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedStars(null);
    setSelectedClass("All Classes");
    localStorage.removeItem("searchTerm");
    sessionStorage.removeItem("selectedClass");
  };

  const handleUnitPreferenceChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newUnit = e.target.value as "metric" | "imperial";
    setUnitPreference(newUnit);
    localStorage.setItem("preferredUnit", newUnit);
  };

  const handlePageSizeChange = (size: number) => {
    setCars([]);
    setCarsPerPage(size);
  };

  // ✅ Backend now handles search + class filtering. Star filter stays local.
  const filteredCars = cars
    .filter((car) => (selectedStars ? car.Stars === selectedStars : true))
    .sort((a, b) => (selectedClass === "All Classes" ? a.Stars - b.Stars : 0));

  if (error) {
    return (
      <div className="cars">
        <PageTab title="Cars">
          <Header text="Cars" />
          <div className="error-message">{error}</div>
          <CarFilters
            onSearch={handleSearch}
            onFilter={handleStarFilter}
            onClassChange={handleClassChange}
            onUnitChange={handleUnitPreferenceChange}
            onReset={handleResetFilters}
            selectedClass={selectedClass}
            unitPreference={unitPreference}
          />
          <ClassTables
            cars={[]}
            selectedClass={selectedClass}
            loading={loading}
          />
        </PageTab>
      </div>
    );
  }

  return (
    <div className="cars">
      <PageTab title="Cars">
        <Header text="Cars" />

        <CarTrackerToggle
          isEnabled={trackerMode}
          onToggle={(value) => {
            setTrackerMode(value);
            localStorage.setItem("trackerMode", String(value));
          }}
        />

        <div className="trackerSummaryLink">
          <button className="trackerSummary" onClick={() => navigate("/car-tracker")}>
            My Car Tracker Summary
          </button>
        </div>

        <CarFilters
          onSearch={handleSearch}
          onFilter={handleStarFilter}
          onClassChange={handleClassChange}
          onUnitChange={handleUnitPreferenceChange}
          onReset={handleResetFilters}
          selectedClass={selectedClass}
          unitPreference={unitPreference}
        />

        <p className="car-count">
          Showing {filteredCars.length} of {totalCount} car
          {totalCount !== 1 ? "s" : ""}
        </p>

        <ClassTables
          cars={filteredCars}
          selectedClass={selectedClass}
          loading={loading}
          trackerMode={trackerMode}
        />

        <div className="page-size-control">
          <span>Cars per page:</span>
          {[25, 50, 100, 200, 300].map((size) => (
            <button
              key={size}
              onClick={() => handlePageSizeChange(size)}
              disabled={carsPerPage === size}
            >
              {size}
            </button>
          ))}
        </div>
      </PageTab>
    </div>
  );
}
