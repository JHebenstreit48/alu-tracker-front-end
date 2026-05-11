import { DropdownsProps } from '@/types/Cars/Filters/DropdownsProps';
import { CheckboxesProps } from '@/types/Cars/Filters/CheckboxesProps';
import { SearchBarProps } from '@/types/Cars/Filters/SearchBarProps';

export interface CarFiltersProps extends DropdownsProps, CheckboxesProps, SearchBarProps {
  onReset: () => void;
}