import { createContext, useContext, useState } from 'react';
import type { Car } from '@/types/shared/car';

interface FilteredCarsContextValue {
  filteredCars: Car[];
  setFilteredCars: (cars: Car[]) => void;
}

const FilteredCarsContext = createContext<FilteredCarsContextValue>({
  filteredCars: [],
  setFilteredCars: () => {},
});

export function FilteredCarsProvider({ children }: { children: React.ReactNode }) {
  const [filteredCars, setFilteredCars] = useState<Car[]>([]);
  return (
    <FilteredCarsContext.Provider value={{ filteredCars, setFilteredCars }}>
      {children}
    </FilteredCarsContext.Provider>
  );
}

export function useFilteredCarsContext() {
  return useContext(FilteredCarsContext);
}

export function getLocalFilteredCars(): Car[] {
  try {
    const raw = localStorage.getItem('filteredCars');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function setLocalFilteredCars(cars: Car[]) {
  try {
    localStorage.setItem('filteredCars', JSON.stringify(cars));
  } catch {
    // localStorage full or unavailable
  }
}