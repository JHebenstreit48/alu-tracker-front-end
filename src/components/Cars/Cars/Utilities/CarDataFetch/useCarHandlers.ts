import { useState, useCallback } from "react";

export function useCarHandlers() {
  const [searchTerm, setSearchTerm] = useState(localStorage.getItem("searchTerm") || "");
  const [selectedStars, setSelectedStars] = useState<number | null>(null);
  const [selectedBrand, setSelectedBrand] = useState(localStorage.getItem("selectedBrand") || "");
  const [selectedCountry, setSelectedCountry] = useState(localStorage.getItem("selectedCountry") || "");
  const [selectedClass, setSelectedClass] = useState(sessionStorage.getItem("selectedClass") || "All Classes");
  const [selectedRarity, setSelectedRarity] = useState<string | null>(
    () => localStorage.getItem("selectedRarity") || null
  );

  const [carsPerPage, setCarsPerPage] = useState(() => {
    const saved = localStorage.getItem("carsPerPage");
    return saved ? parseInt(saved, 10) : 25;
  });

  const [currentPage, setCurrentPage] = useState(() => {
    const saved = localStorage.getItem("currentPage");
    return saved ? parseInt(saved, 10) : 1;
  });

  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term);
    localStorage.setItem("searchTerm", term);
    setCurrentPage(1);
    localStorage.setItem("currentPage", "1");
  }, []);

  const handleStarFilter = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedStars(value ? parseInt(value, 10) : null);
    setCurrentPage(1);
    localStorage.setItem("currentPage", "1");
  }, []);

  const handleClassChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const newClass = e.target.value;
    setSelectedClass(newClass);
    sessionStorage.setItem("selectedClass", newClass);
    setCurrentPage(1);
    localStorage.setItem("currentPage", "1");
  }, []);

  const handleRarityChange = useCallback((rarity: string | null) => {
    setSelectedRarity(rarity);
    if (rarity) {
      localStorage.setItem("selectedRarity", rarity);
    } else {
      localStorage.removeItem("selectedRarity");
    }
    setCurrentPage(1);
    localStorage.setItem("currentPage", "1");
  }, []);

  const handleBrandChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setSelectedBrand(val);
    localStorage.setItem("selectedBrand", val);
    setCurrentPage(1);
    localStorage.setItem("currentPage", "1");
  }, []);

  const handleCountryChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setSelectedCountry(val);
    localStorage.setItem("selectedCountry", val);

    // Reset brand when switching countries
    setSelectedBrand("");
    localStorage.setItem("selectedBrand", "");

    setCurrentPage(1);
    localStorage.setItem("currentPage", "1");
  }, []);

  const handleResetFilters = useCallback(() => {
    setSearchTerm("");
    setSelectedStars(null);
    setSelectedBrand("");
    setSelectedCountry("");
    setSelectedClass("All Classes");
    setSelectedRarity(null);
    setCarsPerPage(25);
    setCurrentPage(1);

    localStorage.removeItem("searchTerm");
    localStorage.removeItem("selectedBrand");
    localStorage.removeItem("selectedCountry");
    localStorage.removeItem("selectedRarity");
    sessionStorage.removeItem("selectedClass");
    localStorage.setItem("carsPerPage", "25");
    localStorage.setItem("currentPage", "1");
  }, []);

  return {
    searchTerm,
    selectedStars,
    selectedBrand,
    selectedCountry,
    selectedClass,
    selectedRarity,
    carsPerPage,
    currentPage,
    setCurrentPage,
    setCarsPerPage,
    handleSearch,
    handleStarFilter,
    handleClassChange,
    handleRarityChange,
    handleBrandChange,
    handleCountryChange,
    handleResetFilters
  };
}