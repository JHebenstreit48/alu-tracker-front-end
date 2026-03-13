import { useState } from "react";
import { useLegendStoreFilters } from "@/hooks/LegendStore/useLegendStoreFilters";
import Header from "@/components/Shared/HeaderFooter/Header";
import PageTab from "@/components/Shared/Navigation/PageTab";
import Filters from "@/components/LegendStore/Filters";
import Tables from "@/components/LegendStore/Tables";
import MobileViewToggle, { type MobileView } from "@/components/LegendStore/MobileViewToggle";
import "@/scss/LegendStore/LegendStore.scss";

export default function LegendStorePrices() {
  const { filters, setFilters, reset } = useLegendStoreFilters();
  const [mobileView, setMobileView] = useState<MobileView>("card");

  return (
    <PageTab title="Legend Store Prices">
      <Header text="Legend Store" />
      <Filters
        filters={filters}
        onChange={setFilters}
        onReset={reset}
      />
      <MobileViewToggle view={mobileView} onChange={setMobileView} />
      <Tables filters={filters} mobileView={mobileView} />
    </PageTab>
  );
}