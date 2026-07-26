import { Link } from 'react-router-dom';

import type { Brand } from '@/types/Brands';
import { groupBrandsByCountryAndLetter } from '@/utils/brands/brandsByCountryAndLetter';
import { getImageUrl } from '@/utils/shared/imageUrl';

import '@/scss/brands/BrandQuickList.scss';

interface BrandQuickListProps {
  manufacturers: Brand[];
}

export default function BrandQuickList({ manufacturers }: BrandQuickListProps) {
  if (!manufacturers || manufacturers.length === 0) {
    return <div className="error-message">No manufacturers found.</div>;
  }

  const grouped = groupBrandsByCountryAndLetter(manufacturers);
  const sortedCountries = Object.keys(grouped).sort();

  return (
    <div className="brand-quick-list">
      {sortedCountries.map((country) => {
        const sortedLetters = Object.keys(grouped[country]).sort();

        return (
          <div key={country} className="country-section">
            <h2 className="country-header">{country}</h2>
            <hr />

            {sortedLetters.map((letter) => (
              <div key={letter} className="brand-letter-section">
                <h3>{letter}</h3>
                <ul>
                  {grouped[country][letter].map((manufacturer) => {
                    const logoUrl = manufacturer.logo
                      ? getImageUrl(manufacturer.logo)
                      : null;

                    return (
                      <li key={manufacturer.slug}>
                        <Link
                          to={`/brands/${manufacturer.slug}`}
                          className="brand-list-link"
                        >
                          <span className="brand-list-logo-slot">
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
                          <span className="brand-list-name">
                            {manufacturer.brand}
                          </span>
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
    </div>
  );
}