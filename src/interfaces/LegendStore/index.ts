export interface LegendStoreBlueprint {
    Class: string;
    Brand: string;
    Model: string;
    GarageLevel?: number;
    StarRank: number;
    CarRarity: string;
    BlueprintPrices: number[];
  }
  
  export interface LegendStoreFilters {
    selectedClass: string;
    selectedCarRarity: string | null;
    searchTerm: string;
    selectedCumulativeLevel: number | null;
    selectedIndividualLevel: number | null;
    selectedStarRank: number | null;
  }  