import { useState } from "react";
import { useLegendStoreFilters } from "@/hooks/LegendStore/useLegendStoreFilters";
import Header from "@/components/Shared/HeaderFooter/Header";
import PageTab from "@/components/Shared/Navigation/PageTab";
import Filters from "@/components/LegendStore/Filters";
import Tables from "@/components/LegendStore/Tables";
import TradeCoinTables from "@/components/LegendStore/TradeCoinTables";
import ImportTables from "@/components/LegendStore/ImportTables";
import MobileViewToggle, { type MobileView } from "@/components/LegendStore/MobileViewToggle";
import StoreViewToggle, { type StoreView } from "@/components/LegendStore/StoreViewToggle";
import "@/scss/LegendStore/LegendStore.scss";

export default function LegendStorePrices() {
  const { filters, setFilters, reset } = useLegendStoreFilters();
  const [mobileView, setMobileView] = useState<MobileView>("card");
  const [storeView, setStoreView] = useState<StoreView>("credits");

  return (
    <PageTab title="Legend Store Prices">
      <Header text="Legend Store" />
      <Filters filters={filters} onChange={setFilters} onReset={reset} />
      <StoreViewToggle view={storeView} onChange={setStoreView} />
      {storeView === "credits" && (
        <>
          <MobileViewToggle view={mobileView} onChange={setMobileView} />
          <div className="legendStoreGrid">
            <Tables filters={filters} mobileView={mobileView} />
          </div>
        </>
      )}
      {storeView === "tradeCoins" && (
        <>
          <MobileViewToggle view={mobileView} onChange={setMobileView} />
          <div className="legendStoreGrid">
            <TradeCoinTables filters={filters} mobileView={mobileView} />
          </div>
        </>
      )}
      {storeView === "imports" && (
        <>
          <MobileViewToggle view={mobileView} onChange={setMobileView} />
          <div className="legendStoreGrid">
            <ImportTables filters={filters} mobileView={mobileView} />
          </div>
        </>
      )}
    </PageTab>
  );
}