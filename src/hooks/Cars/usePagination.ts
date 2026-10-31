import { useState, useEffect, useCallback, useRef } from 'react';
import type { Car } from '@/types/shared/car';
import { DEFAULT_PAGE_SIZE, isPageSize, type PageSize } from '@/utils/Cars/Filters/pagination';

const readNumber = (key: string) => parseInt(localStorage.getItem(key) ?? '', 10);

const readPageSize = (): PageSize => {
  const saved = readNumber('carsPerPage');
  return isPageSize(saved) ? saved : DEFAULT_PAGE_SIZE;
};

const readPage = (): number => {
  const saved = readNumber('currentPage');
  return saved > 0 ? saved : 1;
};

export function useCarPagination(filteredCars: Car[], resetKey: string) {
  const [carsPerPage, setCarsPerPage] = useState<PageSize>(readPageSize);
  const [currentPage, setCurrentPage] = useState<number>(readPage);

  const totalFiltered = filteredCars.length;
  const totalPages = Math.max(1, Math.ceil(totalFiltered / carsPerPage));

  const goToPage = useCallback((page: number) => {
    setCurrentPage(page);
    localStorage.setItem('currentPage', String(page));
  }, []);

  const lastResetKey = useRef(resetKey);
  useEffect(() => {
    if (lastResetKey.current === resetKey) return;
    lastResetKey.current = resetKey;
    goToPage(1);
  }, [resetKey, goToPage]);

  useEffect(() => {
    if (totalFiltered > 0 && currentPage > totalPages) goToPage(totalPages);
  }, [currentPage, totalPages, totalFiltered, goToPage]);

  const handlePageSizeChange = useCallback(
    (size: PageSize) => {
      setCarsPerPage(size);
      localStorage.setItem('carsPerPage', String(size));
      goToPage(1);
    },
    [goToPage]
  );

  const handlePageChange = useCallback(
    (page: number) => {
      if (page < 1 || page > totalPages) return;
      goToPage(page);
    },
    [totalPages, goToPage]
  );

  const start = (currentPage - 1) * carsPerPage;
  const paginatedCars = filteredCars.slice(start, start + carsPerPage);

  return {
    carsPerPage,
    currentPage,
    totalPages,
    totalFiltered,
    paginatedCars,
    rangeStart: totalFiltered ? start + 1 : 0,
    rangeEnd: start + paginatedCars.length,
    handlePageSizeChange,
    handlePageChange,
  };
}