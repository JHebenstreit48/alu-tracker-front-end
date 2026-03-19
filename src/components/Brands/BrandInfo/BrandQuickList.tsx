import { Link } from "react-router-dom";
import "@/scss/Brands/BrandQuickList.scss";
import type { Brand } from "@/types/Brands";
import { getImageUrl } from "@/utils/shared/imageUrl";

interface BrandQuickListProps {
  manufacturers: Brand[];
}

export default function BrandQuickList({ manufacturers }: BrandQuickListProps) {
  if (!manufacturers || manufacturers.length === 0) {
    return <div className="error-message">No manufacturers found.</div>;
  }

  const groupedByCountry = manufacturers.reduce(
    (acc: Record<string, Brand[]>, manufacturer) => {
      const countries =
        manufacturer.country && manufacturer.country.length > 0
          ? manufacturer.country
          : ["Unknown"];
      countries.forEach((country) => {
        if (!acc[country]) acc[country] = [];
        acc[country].push(manufacturer);
      });
      return acc;
    },
    {}
  );

  const sortedCountries = Object.keys(groupedByCountry).sort();

  return (
    <div className="brand-quick-list">
      {sortedCountries.map((country) => {
        const groupedByLetter = groupedByCountry[country].reduce(
          (acc: Record<string, Brand[]>, manufacturer) => {
            const firstLetter = manufacturer.brand.charAt(0).toUpperCase();
            if (!acc[firstLetter]) acc[firstLetter] = [];
            acc[firstLetter].push(manufacturer);
            return acc;
          },
          {}
        );

        const sortedLetters = Object.keys(groupedByLetter).sort();

        return (
          <div key={country} className="country-section">
            <h2 className="country-header">{country}</h2>
            <hr />

            {sortedLetters.map((letter) => (
              <div key={letter} className="brand-letter-section">
                <h3>{letter}</h3>
                <ul>
                  {groupedByLetter[letter]
                    .sort((a, b) => a.brand.localeCompare(b.brand))
                    .map((manufacturer) => {
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
                                    (e.currentTarget as HTMLImageElement).style.display = "none";
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