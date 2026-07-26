import { useParams, useNavigate } from 'react-router-dom';

import { useBrandBySlug } from '@/hooks/Brands/useBrandsBySlug';
import { getImageUrl } from '@/utils/shared/imageUrl';

import Header from '@/components/Shared/header/Header';
import BrandHero from '@/components/Brands/BrandInformation/BrandHero';
import BrandDetailsList from '@/components/Brands/BrandInformation/BrandDetailsList';
import BrandResourcesList from '@/components/Brands/BrandInformation/BrandResourcesList';

import '@/scss/brands/info/index.scss';

export default function BrandInfo() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { brand, loading, error } = useBrandBySlug(slug);

  const handleGoBack = () => navigate('/brands');

  if (loading) {
    return <div className="loading-message">Loading brand details...</div>;
  }

  if (error || !brand) {
    return (
      <div className="error-message">
        Brand not found or failed to load.
        <button className="backBtn" onClick={handleGoBack}>
          Back
        </button>
      </div>
    );
  }

  const logoUrl = brand.logo ? getImageUrl(brand.logo) : '';

  return (
    <div className="brand-info-page">
      <Header />

      <button className="backBtn" onClick={handleGoBack}>
        Back
      </button>

      <BrandHero brand={brand} logoUrl={logoUrl} />

      <BrandDetailsList brand={brand} />

      {brand.resources && <BrandResourcesList resources={brand.resources} />}
    </div>
  );
}