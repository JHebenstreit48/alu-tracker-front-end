import Header from "@/components/Shared/HeaderFooter/Header";
import PageTab from "@/components/Shared/Navigation/PageTab";
import LoadingSpinner from "@/components/Shared/Loading/LoadingSpinner";
import BackToTop from "@/components/Shared/Navigation/BackToTopButton";

import BrandQuickList from "@/components/Brands/BrandInfo/BrandQuickList";
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
              <LoadingSpinner />
              <p>Warming up the brands…</p>
            </div>
          </div>
        ) : (
          <BrandQuickList manufacturers={brands} />
        )}

        <BackToTop />
      </PageTab>
    </div>
  );
}