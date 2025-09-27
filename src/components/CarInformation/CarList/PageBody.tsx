import ClassTables from "@/components/CarInformation/CarList/ClassTables/ClassTables";
import CarFilters from "@/components/CarInformation/CarList/CarFilters/CarFilters";
import CarTrackerToggle from "@/components/CarInformation/CarList/TrackerButtons/CarTrackerToggle";
import Header from "@/components/Shared/Header";
import PageTab from "@/components/Shared/PageTab";
import { useNavigate } from "react-router-dom";

import "@/scss/Cars/CarsPage/index.scss";

import { Car } from "@/components/CarInformation/CarList/CarFilters/types/CarTypes";

interface CarDataProps {
  loading: boolean;
  trackerMode: boolean;
  toggleTrackerMode: (val: boolean) => void;

  // Filters
  filterProps: {
    searchTerm: string;
    selectedStars: number | null;
    selectedBrand: string;
    selectedCountry: string;
    selectedClass: string;
    selectedRarity: string | null;
    unitPreference: "metric" | "imperial";
    showOwned: boolean;
    showKeyCars: boolean;
    availableBrands: string[];
    availableCountries: string[];
    onSearch: (term: string) => void;
    onStarsChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    onClassChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    onRarityChange: (rarity: string | null) => void;
    onBrandChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    onCountryChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    onUnitChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    onToggleOwned: () => void;
    onToggleKeyCars: () => void;
    onReset: () => void;
  };

  // Table Data
  cars: Car[];
  selectedClass: string;

  // Pagination Controls
  carsPerPage: number;
  handlePageSizeChange: (size: number) => void;
  totalFiltered: number;
}

export default function CarData({
  loading,
  trackerMode,
  toggleTrackerMode,
  filterProps,
  cars,
  selectedClass,
  carsPerPage,
  handlePageSizeChange,
  totalFiltered,
}: CarDataProps) {
  const navigate = useNavigate();

  return (
    <div className="cars">
      <PageTab title="Cars">
        <Header text="Cars" className="carsHeader" />

        <div className="trackerControlsRow">
          <CarTrackerToggle isEnabled={trackerMode} onToggle={toggleTrackerMode} />
          <div className="trackerSummaryLink">
            <button className="trackerSummary" onClick={() => navigate("/car-tracker")}>
              Account Progress
            </button>
          </div>
        </div>

        <CarFilters
          {...filterProps}
          availableStars={[3, 4, 5, 6]}
        />

        <p className="carCount">
          Showing {cars.length} of {totalFiltered} car{totalFiltered !== 1 ? "s" : ""}
        </p>

        <ClassTables
          cars={cars}
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