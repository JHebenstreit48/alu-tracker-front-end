import type { Brand } from '@/types/Brands';

interface BrandResourcesListProps {
  resources: NonNullable<Brand['resources']>;
}

export default function BrandResourcesList({ resources }: BrandResourcesListProps) {
  if (resources.length === 0) return null;

  return (
    <div className="brand-resources">
      <h3>Resources</h3>
      <ul>
        {resources.map((res, idx) => (
          <li key={idx}>
            <a href={res.url} target="_blank" rel="noopener noreferrer">
              {res.text}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}