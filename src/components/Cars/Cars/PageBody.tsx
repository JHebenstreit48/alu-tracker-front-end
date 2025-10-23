import ClassTables from '@/components/Cars/Cars/ClassTables/ClassTables';
import CarFilters from '@/components/Cars/Cars/CarFilters/CarFilters';
import Header from '@/components/Shared/HeaderFooter/Header';
import PageTab from '@/components/Shared/Navigation/PageTab';
import { useNavigate } from 'react-router-dom';

import '@/scss/Cars/CarsPage/index.scss';

import { Car } from '@/components/Cars/Cars/CarFilters/types/CarTypes';

interface CarDataProps {
  loading: boolean;
  trackerMode: boolean;

  // Filters
  filterProps: {
    searchTerm: string;
    selectedStars: number | null;
    selectedBrand: string;
    selectedCountry: string;
    selectedClass: string;
    selectedRarity: string | null;
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
    onToggleOwned: () => void;
    onToggleKeyCars: () => void;
    onReset: () => void;
  };

  cars: Car[];
  selectedClass: string;

  carsPerPage: number;
  handlePageSizeChange: (size: number) => void;
  totalFiltered: number;
}

export default function CarData({
  loading,
  trackerMode,
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
        <Header
          text="Cars"
          className="carsHeader"
        />

        <div className="filtersAndTrackerLink">
          <CarFilters
            {...filterProps}
            availableStars={[3, 4, 5, 6]}
          />

          <div className="trackerSummaryLink">
            <button
              className="trackerSummary"
              onClick={() => navigate('/car-tracker')}
            >
              Account Progress
            </button>
          </div>
        </div>

        <p className="carCount">
          Showing {cars.length} of {totalFiltered} car{totalFiltered !== 1 ? 's' : ''}
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