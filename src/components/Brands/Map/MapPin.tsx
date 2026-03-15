import { Marker } from "react-map-gl";
import { useNavigate } from "react-router-dom";
import type { Brand } from "@/types/Brands";
import "@/scss/Brands/BrandMap.scss";


export default function MapPin({ manufacturer }: { manufacturer: Brand }) {
  const navigate = useNavigate();

  return (
    <Marker
      longitude={manufacturer.location.lng}
      latitude={manufacturer.location.lat}
      anchor="bottom"
      style={{ cursor: "pointer" }}
    >
      <button
        className="map-pin"
        title={manufacturer.brand}
        onClick={() => navigate(`/brands/${manufacturer.slug}`)}
        aria-label={`View ${manufacturer.brand}`}
      >
        <svg width="28" height="36" viewBox="0 0 28 36" fill="none" aria-hidden="true">
          <path d="M14 0C6.268 0 0 6.268 0 14c0 9.333 14 22 14 22S28 23.333 28 14C28 6.268 21.732 0 14 0z"
            fill="currentColor" />
          <circle cx="14" cy="14" r="5" fill="white" opacity="0.9" />
        </svg>
      </button>
    </Marker>
  );
}
