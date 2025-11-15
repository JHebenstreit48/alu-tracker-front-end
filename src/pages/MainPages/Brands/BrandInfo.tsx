import { useParams, useNavigate } from "react-router-dom";
import "@/scss/Brands/BrandInfo.scss";

import { useBrandBySlug } from "@/hooks/Brands/useBrandsBySlug";
import { getImageUrl } from "@/utils/shared/imageUrl";

export default function BrandInfo() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { brand, loading, error } = useBrandBySlug(slug);

  const handleGoBack = () => navigate("/brands");

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

  // Logos now live in Firebase Storage (or absolute URLs).
  // brand.logo should be something like:
  //   - "images/logos/A/apollo_automobili.png"  (your bucket path)
  //   - OR an https URL
  const logoUrl = brand.logo ? getImageUrl(brand.logo) : "";

  return (
    <div className="brand-info-page">
      <button className="backBtn" onClick={handleGoBack}>
        Back
      </button>

      <h1 className="brand-name">{brand.brand}</h1>

      {logoUrl && (
        <img
          src={logoUrl}
          alt={`${brand.brand} logo`}
          className="brand-logo"
          loading="lazy"
        />
      )}

      <p className="brand-description">{brand.description}</p>

      <ul className="brand-details">
        <li>
          <strong>Country:</strong> {brand.country.join(", ")}
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

      {brand.resources && brand.resources.length > 0 && (
        <div className="brand-resources">
          <h3>Resources</h3>
          <ul>
            {brand.resources.map((res, idx) => (
              <li key={idx}>
                <a href={res.url} target="_blank" rel="noopener noreferrer">
                  {res.text}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}