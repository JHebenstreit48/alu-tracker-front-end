import Map, { NavigationControl } from "react-map-gl";
import { LngLatBounds } from "mapbox-gl";
import { useRef, useEffect, useState, useCallback } from "react";
import MapPin from "@/components/Brands/Map/MapPin";
import type { Brand } from "@/types/Brands";
import "mapbox-gl/dist/mapbox-gl.css";
import "@/scss/Brands/BrandMap.scss";

interface MapDisplayProps {
  manufacturers: Brand[];
}

export default function MapDisplay({ manufacturers }: MapDisplayProps) {
  const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;
  const MAPBOX_STYLE_URL = import.meta.env.VITE_MAPBOX_STYLE_URL;

  const mapRef = useRef<InstanceType<typeof Map> | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  const handleMapLoad = useCallback(() => {
    setMapLoaded(true);
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapLoaded || manufacturers.length === 0) return;

    if (manufacturers.length === 1) {
      const { lat, lng } = manufacturers[0].location;
      map.flyTo({ center: [lng, lat], zoom: 5, duration: 1000 });
    } else {
      const bounds = new LngLatBounds();
      manufacturers.forEach(({ location }) =>
        bounds.extend([location.lng, location.lat])
      );
      map.fitBounds(bounds, { padding: 80, duration: 1000 });
    }
  }, [manufacturers, mapLoaded]);

  if (!MAPBOX_TOKEN || !MAPBOX_STYLE_URL) {
    return <div className="error-message">Map configuration missing.</div>;
  }

  return (
    <div className="map-wrapper">
      <div className="map-container">
        <Map
          ref={mapRef}
          mapboxAccessToken={MAPBOX_TOKEN}
          mapStyle={MAPBOX_STYLE_URL}
          initialViewState={{
            latitude: 20,
            longitude: 0,
            zoom: 2,
          }}
          onLoad={handleMapLoad}
          style={{ width: "100%", height: "100%" }}
          maxBounds={[-180, -85, 180, 85]}
          attributionControl={true}
        >
          <NavigationControl position="top-left" />
          {manufacturers.map((m) => (
            <MapPin key={m.slug} manufacturer={m} />
          ))}
        </Map>
      </div>
    </div>
  );
}