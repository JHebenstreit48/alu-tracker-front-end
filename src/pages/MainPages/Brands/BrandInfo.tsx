import { useParams, useNavigate } from "react-router-dom";
import "@/scss/Brands/BrandInfo.scss";

import { useBrandBySlug } from "@/hooks/Brands/useBrandsBySlug";

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
        <button className="backBtn" onClick={handleGoBack}>Back</button>
      </div>
    );
  }

  // For now: keep same logo behavior you had (Render/static compatible)
  const apiBase =
    import.meta.env.VITE_CONTENT_API_BASE_URL ??
    "https://alutracker-api.onrender.com";

  const logoUrl = brand.logo.startsWith("http")
    ? brand.logo
    : import.meta.env.DEV
    ? `${apiBase}${brand.logo}`
    : brand.logo;

  return (
    <div className="brand-info-page">
      <button className="backBtn" onClick={handleGoBack}>
        Back
      </button>

      <h1 className="brand-name">{brand.brand}</h1>

      {brand.logo && (
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