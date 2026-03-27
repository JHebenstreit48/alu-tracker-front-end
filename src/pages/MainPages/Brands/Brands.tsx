import Header from "@/components/Shared/HeaderFooter/Header";
import PageTab from "@/components/Shared/Navigation/PageTab";
import BackToTop from "@/components/Shared/Navigation/BackToTopButton";
import BrandQuickList from "@/components/Brands/BrandInfo/BrandQuickList";
import MapDisplay from "@/components/Brands/Map/MapDisplay";
import { useBrands } from "@/hooks/Brands/useBrands";
import "@/scss/Brands/BrandQuickList.scss";

export default function Brands() {
  const { brands, loading, error } = useBrands();

  return (
    <div className="brands">
      <PageTab title="Brands">
        <Header text="Brands" />

        {error ? (
          <div className="error-message">Failed to load manufacturers.</div>
        ) : loading ? (
          <div className="brandsLoadingWrapper">
            <div className="loadingContainer">
              <p>Loading brands...</p>
            </div>
          </div>
        ) : (
          <>
            <MapDisplay manufacturers={brands} />
            <BrandQuickList manufacturers={brands} />
          </>
        )}

        <BackToTop />
      </PageTab>
    </div>
  );
}