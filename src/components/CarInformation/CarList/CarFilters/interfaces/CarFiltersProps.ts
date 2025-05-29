import { DropdownsProps } from "@/components/CarInformation/CarList/CarFilters/interfaces/DropdownsProps";
import { CheckboxesProps } from "@/components/CarInformation/CarList/CarFilters/interfaces/CheckboxesProps";
import { SearchBarProps } from "@/components/CarInformation/CarList/CarFilters/interfaces/SearchBarProps";

export interface CarFiltersProps extends DropdownsProps, CheckboxesProps, SearchBarProps {
  onReset: () => void;
}
