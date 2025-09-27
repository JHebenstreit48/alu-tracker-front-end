import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ImageCarouselType } from "@/components/HomePage/ImagesForCarousel";
import LoadingSpinner from "@/components/Shared/LoadingSpinner";

const backendImageUrl =
  import.meta.env.VITE_API_BASE_URL ?? "https://alutracker-api.onrender.com";

type ImageCarouselPropsType = {
  project: ImageCarouselType[];
};

// spinner will auto-hide after this even if images are still warming
const MAX_SPINNER_MS = 4000;

export default function ImageCarousel({ project }: ImageCarouselPropsType) {
  // how many <img> have fired onLoad/onError
  const [imagesLoaded, setImagesLoaded] = useState<number>(0);

  // if the user already visited during this tab session, don't show spinner again
  const [isReady, setIsReady] = useState<boolean>(() => {
    return sessionStorage.getItem("carouselReady") === "1";
  });

  const timerRef = useRef<number | null>(null);

  const markReady = useCallback(() => {
    setIsReady(true);
    sessionStorage.setItem("carouselReady", "1");
  }, []);

  // when all images report loaded once, hide the spinner
  useEffect(() => {
    if (isReady) return;
    if (project.length > 0 && imagesLoaded >= project.length) {
      markReady();
    }
  }, [imagesLoaded, isReady, project.length, markReady]);

  // fallback timer for cold backend
  useEffect(() => {
    if (isReady) return;
    timerRef.current = window.setTimeout(markReady, MAX_SPINNER_MS);
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, [isReady, markReady]);

  const handleImageLoad = useCallback(() => {
    setImagesLoaded((n) => n + 1);
  }, []);
  const handleImageError = handleImageLoad;

  // make first image eager to shorten initial spinner
  const eagerIndex = 0;
  const slides = useMemo(() => project, [project]);

  return (
    <div
      id="asphalt-carousel-slides"
      className="carousel slide"
      data-bs-ride="carousel"
      data-bs-interval="2500"
      data-bs-pause="false"
    >
      <div className="carousel-inner">
        {slides.map((image, index) => (
          <div
            key={index}
            className={`carousel-item ${index === 0 ? "active" : ""}`}
          >
            <div className="carousel-image-box">
              {/* image */}
              <img
                src={`${backendImageUrl}${image.path}`}
                alt={`Car Image ${index + 1}`}
                className="d-block w-100"
                loading={index === eagerIndex ? "eager" : "lazy"}
                onLoad={handleImageLoad}
                onError={handleImageError}
              />

              {/* overlay + spinner while warming */}
              {!isReady && (
                <>
                  <div className="carousel-overlay" />
                  <div className="carousel-spinner">
                    <LoadingSpinner message="Cars entering the starting line!" />
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}