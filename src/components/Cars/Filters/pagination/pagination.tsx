import { getPageItems } from '@/utils/Cars/Filters/pagination';

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  position: 'top' | 'bottom';
};

export default function Pagination({ currentPage, totalPages, onPageChange, position }: PaginationProps) {
  if (totalPages <= 1) return null;

  const items = getPageItems(currentPage, totalPages);

  return (
    <div
      className={`carPagination carPagination--${position}`}
      role="navigation"
      aria-label="Car list pages"
    >
      <button
        className="pageNav"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        ‹ Prev
      </button>

      <ul className="pageList">
        {items.map((item, i) =>
          item === 'gap' ? (
            <li key={`gap-${i}`} className="pageGap">
              …
            </li>
          ) : (
            <li key={item}>
              <button
                className={`pageNumber${item === currentPage ? ' isCurrent' : ''}`}
                aria-current={item === currentPage ? 'page' : undefined}
                onClick={() => onPageChange(item)}
                disabled={item === currentPage}
              >
                {item}
              </button>
            </li>
          )
        )}
      </ul>

      <button
        className="pageNav"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next ›
      </button>
    </div>
  );
}