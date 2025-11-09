import { useLegendStoreFilters } from "@/hooks/LegendStore/useLegendStoreFilters";
import Header from "@/components/Shared/HeaderFooter/Header";
import PageTab from "@/components/Shared/Navigation/PageTab";
import Filters from "@/components/LegendStore/Filters";
import Tables from "@/components/LegendStore/Tables";
import "@/scss/LegendStore/LegendStore.scss";

export default function LegendStorePrices() {
  const { filters, setFilters, reset } = useLegendStoreFilters();

  return (
    <PageTab title="Legend Store Prices">
      <Header text="Legend Store" />
      <Filters
        filters={filters}
        onChange={setFilters}
        onReset={reset}
      />
      <Tables filters={filters} />
    </PageTab>
  );
}