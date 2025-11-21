import ClassTables from '@/components/Cars/ClassTables/ClassTables';
import CarFilters from '@/components/Cars/CarFilters/CarFilters';
import Header from '@/components/Shared/HeaderFooter/Header';
import PageTab from '@/components/Shared/Navigation/PageTab';
// ❌ remove this:
// import PaginationControls from '@/components/Cars/Pagination/PaginationControls';
import { useNavigate } from 'react-router-dom';

import '@/scss/Cars/CarsPage/index.scss';
import type { CarDataProps } from '@/interfaces/Cars/carDataProps';

export default function CarData({
  loading,
  trackerMode,
  error,
  filterProps,
  cars,
  selectedClass,
  carsPerPage,
  handlePageSizeChange,
  totalFiltered,
}: CarDataProps) {
  const navigate = useNavigate();

  if (error) {
    return (
      <div className="cars">
        <PageTab title="Cars">
          <Header text="Cars" className="carsHeader" />
          <div className="error-message">{error}</div>
        </PageTab>
      </div>
    );
  }

  return (
    <div className="cars">
      <PageTab title="Cars">
        <Header text="Cars" className="carsHeader" />

        <div className="filtersAndTrackerLink">
          <CarFilters {...filterProps} availableStars={[3, 4, 5, 6]} />
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
          Showing {cars.length} of {totalFiltered} car
          {totalFiltered !== 1 ? 's' : ''}
        </p>

        <ClassTables
          cars={cars}
          selectedClass={selectedClass}
          loading={loading}
          trackerMode={trackerMode}
        />

        <div className="pageSizeControl">
          <span className="paginationLabel">Cars per page:</span>
          {[25, 50, 100, 150, 200, 250, 300, 305].map((size) => (
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