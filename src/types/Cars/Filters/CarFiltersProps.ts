import { DropdownsProps } from '@/types/Cars/Filters/DropdownsProps';
import { CheckboxesProps } from '@/types/Cars/Filters/CheckboxesProps';
import { SearchBarProps } from '@/types/Cars/Filters/SearchBarProps';
import { PageSizeProps } from '@/types/Cars/Filters/pageSizeProps';

export interface CarFiltersProps extends DropdownsProps, CheckboxesProps, SearchBarProps, PageSizeProps {
  onReset: () => void;
}