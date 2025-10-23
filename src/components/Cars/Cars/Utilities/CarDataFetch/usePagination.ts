import { useState, useEffect, useCallback } from "react";
import { Car } from "@/components/Cars/Cars/CarFilters/types/CarTypes";

export function useCarPagination(filteredCars: Car[]) {
  const [carsPerPage, setCarsPerPage] = useState(() => {
    const saved = localStorage.getItem("carsPerPage");
    return saved ? parseInt(saved, 10) : 25;
  });

  const [currentPage, setCurrentPage] = useState(() => {
    const saved = localStorage.getItem("currentPage");
    return saved ? parseInt(saved, 10) : 1;
  });

  useEffect(() => {
    // If filteredCars shrinks below current page range, reset to page 1
    const maxPage = Math.ceil(filteredCars.length / carsPerPage);
    if (currentPage > maxPage) {
      setCurrentPage(1);
      localStorage.setItem("currentPage", "1");
    }
  }, [filteredCars, carsPerPage, currentPage]);

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

  const totalFiltered = filteredCars.length;

  return {
    carsPerPage,
    currentPage,
    paginatedCars,
    totalFiltered,
    setCurrentPage,
    handlePageSizeChange,
  };
}