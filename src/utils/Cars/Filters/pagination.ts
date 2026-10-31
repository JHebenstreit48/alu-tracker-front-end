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

export const PAGE_SIZES = [25, 50, 75] as const;
export type PageSize = (typeof PAGE_SIZES)[number];
export const DEFAULT_PAGE_SIZE: PageSize = 25;

export const isPageSize = (n: number): n is PageSize =>
  (PAGE_SIZES as readonly number[]).includes(n);

export type PageItem = number | 'gap';

export function getPageItems(current: number, total: number, siblings = 1): PageItem[] {
  const pages = new Set<number>([1, total]);
  for (let p = current - siblings; p <= current + siblings; p++) {
    if (p >= 1 && p <= total) pages.add(p);
  }

  const sorted = Array.from(pages).sort((a, b) => a - b);
  const items: PageItem[] = [];

  sorted.forEach((p, i) => {
    const prev = sorted[i - 1];
    if (i > 0 && p - prev > 1) items.push(p - prev === 2 ? p - 1 : 'gap');
    items.push(p);
  });

  return items;
}