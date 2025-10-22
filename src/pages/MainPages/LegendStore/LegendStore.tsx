import Header from "@/components/Shared/HeaderFooter/Header";
import PageTab from "@/components/Shared/Navigation/PageTab";
import Filters from "@/components/LegendStore/Filters";
import Tables from "@/components/LegendStore/Tables";
import '@/scss/LegendStore/LegendStore.scss';

import { useState } from "react";

export default function LegendStorePrices() {
  const [filters, setFilters] = useState<{
    selectedClass: string;
    selectedCarRarity: string | null; // Match type in LegendStoreFiltersAndSearch
    searchTerm: string;
    selectedCumulativeLevel: number | null;
    selectedIndividualLevel: number | null;
    selectedStarRank: number | null;
  }>({
    selectedClass: "All Levels", // Updated default value to "All Levels"
    selectedCarRarity: null,
    searchTerm: "", // Default to an empty string
    selectedCumulativeLevel: null,
    selectedIndividualLevel: null,
    selectedStarRank: null,
  });

  return (
    <>
      <div>
        <PageTab title="Legend Store Prices">
          <Header text="Legend Store" />
          <Filters onFiltersChange={setFilters} />
          <Tables
            selectedClass={filters.selectedClass}
            selectedCarRarity={filters.selectedCarRarity}
            searchTerm={filters.searchTerm}
            selectedCumulativeLevel={filters.selectedCumulativeLevel}
            selectedIndividualLevel={filters.selectedIndividualLevel}
            selectedStarRank={filters.selectedStarRank}
          />
        </PageTab>
      </div>
    </>
  );
}