import CarFilters from "@/components/Cars/Cars/CarFilters/CarFilters";
import { useCarFilterLogic } from "@/components/Cars/Cars/CarFilters/Utilities/useCarFilterLogic";
import { CarFiltersProps } from "@/components/Cars/Cars/CarFilters/interfaces/CarFiltersProps";
import { Car } from "@/types/Cars/CarTypes";

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