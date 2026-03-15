import type {
  LegendStoreImport,
  LegendStoreFilters,
} from "@/types/LegendStore";

export function filterImports(
  all: LegendStoreImport[],
  f: LegendStoreFilters
): LegendStoreImport[] {
  let res = all;

  if (f.selectedCarRarity) {
    res = res.filter((c) => c.CarRarity === f.selectedCarRarity);
  }

  if (f.searchTerm.trim()) {
    const q = f.searchTerm.toLowerCase();
    res = res.filter((c) =>
      `${c.Brand} ${c.Model}`.toLowerCase().includes(q)
    );
  }

  if (f.selectedCumulativeLevel !== null) {
    res = res.filter(
      (c) =>
        typeof c.GarageLevel === "number" &&
        c.GarageLevel <= f.selectedCumulativeLevel!
    );
  }

  if (f.selectedIndividualLevel !== null) {
    res = res.filter((c) => c.GarageLevel === f.selectedIndividualLevel);
  }

  if (f.selectedStarRank !== null) {
    res = res.filter((c) => c.StarRank === f.selectedStarRank);
  }

  return [...res].sort((a, b) => {
    const A = `${a.Brand} ${a.Model}`.toLowerCase();
    const B = `${b.Brand} ${b.Model}`.toLowerCase();
    return A < B ? -1 : A > B ? 1 : 0;
  });
}