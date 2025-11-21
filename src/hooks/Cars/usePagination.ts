import { useState, useEffect, useCallback } from "react";
import { Car } from "@/types/shared/car";

export function useCarPagination(filteredCars: Car[]) {
  const [carsPerPage, setCarsPerPage] = useState(() => {
    const saved = localStorage.getItem("carsPerPage");
    return saved ? parseInt(saved, 10) : 25;
  });

  const [currentPage, setCurrentPage] = useState(() => {
    const saved = localStorage.getItem("currentPage");
    return saved ? parseInt(saved, 10) : 1;
  });

  const totalFiltered = filteredCars.length;
  const totalPages = Math.max(1, Math.ceil(totalFiltered / carsPerPage));

  useEffect(() => {
    // If filteredCars shrinks below current page range, reset to page 1
    if (currentPage > totalPages) {
      setCurrentPage(1);
      localStorage.setItem("currentPage", "1");
    }
  }, [currentPage, totalPages]);

  const paginatedCars = filteredCars.slice(
    (currentPage - 1) * carsPerPage,
    currentPage * carsPerPage
  );

  const handlePageSizeChange = useCallback((size: number) => {
    setCarsPerPage(size);
    localStorage.setItem("carsPerPage", String(size));
    setCurrentPage(1);
    localStorage.setItem("currentPage", "1");
  }, []);

  const handlePageChange = useCallback(
    (page: number) => {
      if (page < 1 || page > totalPages) return;
      setCurrentPage(page);
      localStorage.setItem("currentPage", String(page));
    },
    [totalPages]
  );

  return {
    carsPerPage,
    currentPage,
    paginatedCars,
    totalFiltered,
    totalPages,
    handlePageSizeChange,
    handlePageChange,
    // you *can* keep setCurrentPage here if anything else uses it
    setCurrentPage,
  };
}