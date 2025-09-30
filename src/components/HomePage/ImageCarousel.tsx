import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ImageCarouselType } from "@/components/HomePage/ImagesForCarousel";
import LoadingSpinner from "@/components/Shared/LoadingSpinner";
import { useCarousel } from "@/components/HomePage/Carousel/useCarousel";
import { Slide } from "@/components/HomePage/Carousel/Slide";

const backendImageUrl =
  import.meta.env.VITE_API_BASE_URL ?? "https://alutracker-api.onrender.com";

type Props = {
  project: ImageCarouselType[];
  intervalMs?: number;
  pauseOnHover?: boolean;
};

const MAX_SPINNER_MS = 4000;

export default function ImageCarousel({
  project,
  intervalMs = 2500,
  pauseOnHover = true,
}: Props) {
  const slides = useMemo(() => project ?? [], [project]);
  const [imagesLoaded, setImagesLoaded] = useState(0);
  const [isReady, setIsReady] = useState(
    () => sessionStorage.getItem("carouselReady") === "1"
  );
  const timerRef = useRef<number | null>(null);

  const { active, setActive, hoverProps } = useCarousel({
    length: slides.length,
    intervalMs,
    pauseOnHover,
  });

  const markReady = useCallback(() => {
    setIsReady(true);
    sessionStorage.setItem("carouselReady", "1");
  }, []);

  const onLoad = useCallback(() => setImagesLoaded((n) => n + 1), []);
  const onError = onLoad;

  // hide spinner when all images load once
  useEffect(() => {
    if (isReady) return;
    if (slides.length > 0 && imagesLoaded >= slides.length) markReady();
  }, [imagesLoaded, isReady, slides.length, markReady]);

  // fallback timer
  useEffect(() => {
    if (isReady) return;
    timerRef.current = window.setTimeout(markReady, MAX_SPINNER_MS);
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, [isReady, markReady]);

  if (!slides.length) return null;

  return (
    <div
      id="asphalt-carousel-slides"
      className="carousel slide"
      aria-roledescription="carousel"
      aria-label="Featured cars"
      {...hoverProps}
    >
      <div className="carousel-inner" onFocus={() => setActive(active)}>
        {slides.map((image, i) => (
          <Slide
            key={i}
            src={`${backendImageUrl}${image.path}`}
            alt={`Car Image ${i + 1}`}
            isActive={i === active}
            showOverlay={!isReady}
            eager={i === 0}
            onLoad={onLoad}
            onError={onError}
          />
        ))}
      </div>

      {!isReady && (
        <div className="carousel-spinner">
          <LoadingSpinner message="Cars entering the starting line!" />
        </div>
      )}
    </div>
  );
}