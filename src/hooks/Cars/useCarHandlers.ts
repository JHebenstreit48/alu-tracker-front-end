import { useState, useCallback } from 'react';

export function useCarHandlers() {
  const [searchTerm, setSearchTerm] = useState(localStorage.getItem('searchTerm') || '');
  const [selectedStars, setSelectedStars] = useState<number | null>(null);
  const [selectedBrand, setSelectedBrand] = useState(localStorage.getItem('selectedBrand') || '');
  const [selectedCountry, setSelectedCountry] = useState(localStorage.getItem('selectedCountry') || '');
  const [selectedClass, setSelectedClass] = useState(sessionStorage.getItem('selectedClass') || 'All Classes');
  const [selectedRarity, setSelectedRarity] = useState<string | null>(
    () => localStorage.getItem('selectedRarity') || null
  );

  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term);
    localStorage.setItem('searchTerm', term);
  }, []);

  const handleStarFilter = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedStars(value ? parseInt(value, 10) : null);
  }, []);

  const handleClassChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const newClass = e.target.value;
    setSelectedClass(newClass);
    sessionStorage.setItem('selectedClass', newClass);
  }, []);

  const handleRarityChange = useCallback((rarity: string | null) => {
    setSelectedRarity(rarity);
    if (rarity) localStorage.setItem('selectedRarity', rarity);
    else localStorage.removeItem('selectedRarity');
  }, []);

  const handleBrandChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setSelectedBrand(val);
    localStorage.setItem('selectedBrand', val);
  }, []);

  const handleCountryChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setSelectedCountry(val);
    localStorage.setItem('selectedCountry', val);
    setSelectedBrand('');
    localStorage.setItem('selectedBrand', '');
  }, []);

  const handleResetFilters = useCallback(() => {
    setSearchTerm('');
    setSelectedStars(null);
    setSelectedBrand('');
    setSelectedCountry('');
    setSelectedClass('All Classes');
    setSelectedRarity(null);

    localStorage.removeItem('searchTerm');
    localStorage.removeItem('selectedBrand');
    localStorage.removeItem('selectedCountry');
    localStorage.removeItem('selectedRarity');
    sessionStorage.removeItem('selectedClass');
  }, []);

  return {
    searchTerm,
    selectedStars,
    selectedBrand,
    selectedCountry,
    selectedClass,
    selectedRarity,
    handleSearch,
    handleStarFilter,
    handleClassChange,
    handleRarityChange,
    handleBrandChange,
    handleCountryChange,
    handleResetFilters,
  };
}