import { DropdownsProps } from '@/components/Cars/CarFilters/interfaces/DropdownsProps';
import { CheckboxesProps } from '@/components/Cars/CarFilters/interfaces/CheckboxesProps';
import { SearchBarProps } from '@/components/Cars/CarFilters/interfaces/SearchBarProps';

export interface CarFiltersProps extends DropdownsProps, CheckboxesProps, SearchBarProps {
  onReset: () => void;
}