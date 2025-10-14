import { useEffect, useState } from 'react';

import Header from '@/components/Shared/Header';
import PageTab from '@/components/Shared/PageTab';
import LoadingSpinner from '@/components/Shared/LoadingSpinner';
import BackToTop from '@/components/Shared/BackToTopButton';

import BrandQuickList from '@/components/Brands/BrandInfo/BrandQuickList';

import '@/scss/Brands/BrandQuickList.scss';
// import '@/scss/Brands/BrandMap.scss';

interface Manufacturer {
  _id: string;
  brand: string;
  slug: string;
  logo: string;
  country: string[];
}

export default function Brands() {
  const [manufacturers, setManufacturers] = useState<Manufacturer[]>([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'https://alutracker-api.onrender.com';

  useEffect(() => {
    console.log('🚀 Fetching from:', `${API_BASE_URL}/manufacturers`);
    fetch(`${API_BASE_URL}/api/manufacturers`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log('✅ Manufacturers loaded in Brands.tsx:', data);
        setManufacturers(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('❌ Error loading manufacturers:', err);
        setError(true);
        setLoading(false);
      });
  }, [API_BASE_URL]);

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
          <BrandQuickList manufacturers={manufacturers} />
        )}

        {/* <MapDisplay manufacturers={manufacturers} /> */}

        <BackToTop />
      </PageTab>
    </div>
  );
}