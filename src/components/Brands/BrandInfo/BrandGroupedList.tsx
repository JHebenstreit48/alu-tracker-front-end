import { Link } from 'react-router-dom';

import type { GroupedBrands } from '@/types/Brands';
import { getImageUrl } from '@/utils/shared/imageUrl';

interface BrandGroupedListProps {
  grouped: GroupedBrands;
}

export default function BrandGroupedList({ grouped }: BrandGroupedListProps) {
  const sortedCountries = Object.keys(grouped).sort();

  if (sortedCountries.length === 0) {
    return <div className="error-message">No brands match your filters.</div>;
  }

  return (
    <>
      {sortedCountries.map((countryName) => {
        const sortedLetters = Object.keys(grouped[countryName]).sort();

        return (
          <div key={countryName} className="country-section">
            <h2 className="country-header">{countryName}</h2>
            <hr />

            {sortedLetters.map((letterKey) => (
              <div key={letterKey} className="brand-letter-section" data-letter={letterKey}>
                <h3>{letterKey}</h3>
                <ul>
                  {grouped[countryName][letterKey].map((manufacturer) => {
                    const logoUrl = manufacturer.logo ? getImageUrl(manufacturer.logo) : null;

                    return (
                      <li key={manufacturer.slug}>
                        <Link to={`/brands/${manufacturer.slug}`} className="brand-list-link">
                          <span
                            className={`brand-list-logo-slot${
                              logoUrl ? '' : ' brand-list-logo-slot--empty'
                            }`}
                          >
                            {logoUrl && (
                              <img
                                src={logoUrl}
                                alt=""
                                className="brand-list-logo"
                                loading="lazy"
                                onError={(e) => {
                                  (e.currentTarget as HTMLImageElement).style.display = 'none';
                                }}
                              />
                            )}
                          </span>
                          <span className="brand-list-name">{manufacturer.brand}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}

            <hr />
          </div>
        );
      })}
    </>
  );
}