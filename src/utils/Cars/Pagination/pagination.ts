export function usePaginatedCars<T>(
    filtered: T[],
    currentPage: number,
    itemsPerPage: number
  ): {
    paginated: T[];
    total: number;
  } {
    const total = filtered.length;
    const paginated = filtered.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
    return { paginated, total };
  }