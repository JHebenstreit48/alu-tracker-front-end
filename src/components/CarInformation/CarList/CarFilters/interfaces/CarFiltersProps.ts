import { DropdownsProps } from "./DropdownsProps";
import { CheckboxesProps } from "./CheckboxesProps";
import { SearchBarProps } from "./SearchBarProps";

export interface CarFiltersProps extends DropdownsProps, CheckboxesProps, SearchBarProps {
  onReset: () => void;
}
