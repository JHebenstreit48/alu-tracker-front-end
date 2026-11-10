import { useEffect, useMemo } from 'react';
import type { Car } from '@/types/shared/car';
import type { ObtainMethodFilterValues } from '@/types/Cars/Filters/ObtainMethodFiltersProps';
import {
  useFilteredCarsContext,
  setLocalFilteredCars,
} from '@/context/Cars/filteredCarsContext';
import { matchesObtainMethod } from '@/utils/Cars/Filters/matchObtainMethod';

/** Applies the Obtain Method filter, then shares the result with the filtered-cars context. */
export function useObtainFilteredCars(cars: Car[], values: ObtainMethodFilterValues): Car[] {
  const filteredCars = useMemo(
    () => cars.filter((car) => matchesObtainMethod(car, values)),
    [cars, values]
  );

  const { setFilteredCars } = useFilteredCarsContext();
  const filteredCarsKey = JSON.stringify(filteredCars.map((car) => car.normalizedKey));

  useEffect(() => {
    setFilteredCars(filteredCars);
    setLocalFilteredCars(filteredCars);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredCarsKey]);

  return filteredCars;
}