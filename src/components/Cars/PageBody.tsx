import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import ClassTables from '@/components/Cars/ClassTables/ClassTables';
import CarFilters from '@/components/Cars/Filters/CarFilters';
import CarCount from '@/components/Cars/Filters/pagination/carCount';
import Pagination from '@/components/Cars/Filters/pagination/pagination';
import Header from '@/components/Shared/header/Header';
import PageTab from '@/components/Shared/Navigation/PageTab';

import '@/scss/cars/index.scss';
import type { CarDataProps } from '@/types/Cars/Filters/carPageProps';

export default function CarData({
  loading,
  trackerMode,
  error,
  filterProps,
  cars,
  selectedClass,
  pagination,
}: CarDataProps) {
  const navigate = useNavigate();
  const tableTopRef = useRef<HTMLDivElement>(null);

  const changePage = (page: number) => {
    pagination.onPageChange(page);
    tableTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  if (error) {
    return (
      <div className="cars">
        <PageTab title="Cars">
          <Header className="carsHeader" />
          <div className="error-message">{error}</div>
        </PageTab>
      </div>
    );
  }

  return (
    <div className="cars">
      <PageTab title="Cars">
        <Header className="carsHeader" />

        <div className="filtersAndTrackerLink">
          <CarFilters {...filterProps} availableStars={[3, 4, 5, 6]} />
          <div className="trackerSummaryLink">
            <button className="trackerSummary" onClick={() => navigate('/car-tracker')}>
              Account Progress
            </button>
          </div>
        </div>

        <div ref={tableTopRef}>
          <CarCount
            rangeStart={pagination.rangeStart}
            rangeEnd={pagination.rangeEnd}
            totalFiltered={pagination.totalFiltered}
          />
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={changePage}
            position="top"
          />
        </div>

        <ClassTables
          cars={cars}
          selectedClass={selectedClass}
          loading={loading}
          trackerMode={trackerMode}
        />

        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          onPageChange={changePage}
          position="bottom"
        />
      </PageTab>
    </div>
  );
}