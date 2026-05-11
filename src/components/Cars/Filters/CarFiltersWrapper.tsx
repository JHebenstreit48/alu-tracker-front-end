import CarFilters from "@/components/Cars/Filters/CarFilters";
import { useCarFilterLogic } from "@/utils/Cars/Filters/useCarFilterLogic";
import { CarFiltersProps } from "@/types/Cars/Filters/CarFiltersProps";
import { Car } from "@/types/shared/car";

interface CarFiltersWrapperProps extends Omit<CarFiltersProps, "availableBrands" | "availableCountries"> {
  cars: Car[];
}

export default function CarFiltersWrapper(props: CarFiltersWrapperProps) {
    const { cars, selectedCountry } = props;
    const { filteredBrands, availableCountries } = useCarFilterLogic(cars, selectedCountry);
  
    const safeCountries = availableCountries
      .map((c) => c?.trim())            // remove accidental whitespace
      .filter((c): c is string => !!c); // filter out undefined or empty strings
  
    return (
      <CarFilters
        {...props}
        availableBrands={filteredBrands}
        availableCountries={safeCountries}
      />
    );
  }