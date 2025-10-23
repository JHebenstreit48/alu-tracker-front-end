import { DropdownsProps } from "@/components/Cars/Cars/CarFilters/interfaces/DropdownsProps";
import { CheckboxesProps } from "@/components/Cars/Cars/CarFilters/interfaces/CheckboxesProps";
import { SearchBarProps } from "@/components/Cars/Cars/CarFilters/interfaces/SearchBarProps";

export interface CarFiltersProps extends DropdownsProps, CheckboxesProps, SearchBarProps {
  onReset: () => void;
}
