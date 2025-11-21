import type { FC } from "react";

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const PaginationControls: FC<PaginationControlsProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  if (totalPages <= 1) return null;

  const goTo = (page: number) => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    onPageChange(page);
  };

  return (
    <div className="paginationControls">
      <button
        className="pageButton"
        disabled={currentPage <= 1}
        onClick={() => goTo(currentPage - 1)}
      >
        ‹ Prev
      </button>

      {Array.from({ length: totalPages }, (_, i) => {
        const page = i + 1;
        return (
          <button
            key={page}
            className={
              "pageButton" + (page === currentPage ? " pageButton--active" : "")
            }
            onClick={() => goTo(page)}
          >
            {page}
          </button>
        );
      })}

      <button
        className="pageButton"
        disabled={currentPage >= totalPages}
        onClick={() => goTo(currentPage + 1)}
      >
        Next ›
      </button>
    </div>
  );
};

export default PaginationControls;