import type { PageSizeProps } from '@/types/Cars/Filters/pageSizeProps';
import { PAGE_SIZES, isPageSize } from '@/utils/Cars/Filters/pagination';

export default function PageSizeFilter({ carsPerPage, onPageSizeChange }: PageSizeProps) {
  return (
    <label className="DropdownLabel pageSizeFilter">
      Cars per page:
      <select
        value={carsPerPage}
        onChange={(e) => {
          const size = Number(e.target.value);
          if (isPageSize(size)) onPageSizeChange(size);
        }}
      >
        {PAGE_SIZES.map((size) => (
          <option key={size} value={size}>
            {size}
          </option>
        ))}
      </select>
    </label>
  );
}