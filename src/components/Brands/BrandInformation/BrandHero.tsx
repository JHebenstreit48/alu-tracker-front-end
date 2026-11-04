import type { Brand } from '@/types/Brands';

interface BrandHeroProps {
  brand: Brand;
  logoUrl: string;
}

export default function BrandHero({ brand, logoUrl }: BrandHeroProps) {
  return (
    <>
      <h1 className="brand-name">{brand.brand}</h1>

      {logoUrl && (
        <img
          src={logoUrl}
          alt={`${brand.brand} logo`}
          className="brand-logo"
          data-slug={brand.slug}
          loading="lazy"
        />
      )}

      <p className="brand-description">{brand.description}</p>
    </>
  );
}