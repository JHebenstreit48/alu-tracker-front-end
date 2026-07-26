import type { Brand } from '@/types/Brands';

interface BrandDetailsListProps {
  brand: Brand;
}

export default function BrandDetailsList({ brand }: BrandDetailsListProps) {
  return (
    <ul className="brand-details">
      <li>
        <strong>Country:</strong> {brand.country.join(', ')}
      </li>
      <li>
        <strong>Established:</strong> {brand.established}
      </li>
      {brand.headquarters && (
        <li>
          <strong>Headquarters:</strong> {brand.headquarters}
        </li>
      )}
      {brand.primaryMarket && (
        <li>
          <strong>Primary Market:</strong> {brand.primaryMarket}
        </li>
      )}
    </ul>
  );
}