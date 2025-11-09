import { useEffect, useState } from "react";
import type { LegendStoreFilters } from "@/interfaces/LegendStore";

const defaultFilters: LegendStoreFilters = {
  selectedClass: "All Levels",
  selectedCarRarity: null,
  searchTerm: "",
  selectedCumulativeLevel: null,
  selectedIndividualLevel: null,
  selectedStarRank: null,
};

const LS_KEY = "legendStoreFilters";

function loadFromStorage(): LegendStoreFilters {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return defaultFilters;
    const parsed = JSON.parse(raw) as Partial<LegendStoreFilters>;
    return { ...defaultFilters, ...parsed };
  } catch {
    return defaultFilters;
  }
}

export function useLegendStoreFilters() {
  const [filters, setFilters] = useState<LegendStoreFilters>(loadFromStorage);

  useEffect(() => {
    localStorage.setItem(LS_KEY, JSON.stringify(filters));
  }, [filters]);

  const reset = () => setFilters(defaultFilters);

  return { filters, setFilters, reset };
}