import { useEffect, useMemo, useState } from "react";
import { ImageCarouselType } from "@/components/HomePage/ImagesForCarousel";
import LoadingSpinner from "@/components/Shared/LoadingSpinner";

const backendImageUrl =
  import.meta.env.VITE_API_BASE_URL ?? "https://alutracker-api.onrender.com";

type ImageCarouselPropsType = {
  project: ImageCarouselType[];
};

// Keep spinner until all images (or errors) reported
const FORCE_SPINNER_MODE = false;
const SIMULATED_DELAY = 5000;

export default function ImageCarousel({ project }: ImageCarouselPropsType) {
  const total = useMemo(() => project.length, [project]);
  const [imagesLoaded, setImagesLoaded] = useState(0);
  const [hasLoadedAll, setHasLoadedAll] = useState(false);

  const handleImageLoad = () => setImagesLoaded((n) => n + 1);
  const handleImageError = () => setImagesLoaded((n) => n + 1);

  // Mark complete when all have reported load/error
  useEffect(() => {
    if (!FORCE_SPINNER_MODE && total > 0 && imagesLoaded >= total) {
      setHasLoadedAll(true);
    }
  }, [imagesLoaded, total]);

  // Test mode (optional)
  useEffect(() => {
    if (FORCE_SPINNER_MODE) {
      const t = setTimeout(() => setHasLoadedAll(true), SIMULATED_DELAY);
      return () => clearTimeout(t);
    }
  }, []);

  return (
    <div
      id="asphalt-carousel-slides"
      className="carousel slide"
      data-bs-ride="carousel"
      data-bs-interval="2000"
      data-bs-pause="false"
      aria-label="Featured cars"
    >
      <div className="carousel-inner">
        {project.map((image, index) => {
          const src = `${backendImageUrl}${image.path}`;
          const isFirst = index === 0;

          // No `any`: set fetchpriority through a ref callback
          const setPriorityRef = (el: HTMLImageElement | null) => {
            if (isFirst && el) el.setAttribute("fetchpriority", "high");
          };

          return (
            <div className={`carousel-item ${isFirst ? "active" : ""}`} key={src}>
              <div className="carousel-image-box" style={{ position: "relative", minHeight: "39rem" }}>
                {!FORCE_SPINNER_MODE && (
                  <img
                    ref={setPriorityRef}
                    src={src}
                    alt={`Car Image ${index + 1}`}
                    className="d-block w-100"
                    loading={isFirst ? "eager" : "lazy"}
                    decoding="async"
                    onLoad={handleImageLoad}
                    onError={handleImageError}
                    style={{
                      opacity: hasLoadedAll ? 1 : 0.2,
                      transition: "opacity 300ms ease-in-out",
                    }}
                  />
                )}

                {!hasLoadedAll && (
                  <>
                    <div className="carousel-overlay" />
                    <div className="carousel-spinner">
                      <LoadingSpinner message="Cars entering the starting line!" />
                    </div>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}