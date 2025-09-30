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
  const slides = useMemo<ImageCarouselType[]>(() => project ?? [], [project]);
  const slidesPlus = useMemo(() => (slides.length ? [...slides, slides[0]] : slides), [slides]);

  const [imagesLoaded, setImagesLoaded] = useState<number>(0);
  const [isReady, setIsReady] = useState<boolean>(
    () => sessionStorage.getItem("carouselReady") === "1"
  );
  const timerRef = useRef<number | null>(null);

  const { active, setActive, hoverProps } = useCarousel({
    length: slides.length,
    intervalMs,
    pauseOnHover,
  });

  // --- seamless wrap state ---
  const prevActiveRef = useRef<number>(0);
  const [displayIndex, setDisplayIndex] = useState<number>(0);      // index used for translateX
  const [txEnabled, setTxEnabled] = useState<boolean>(true);
  const trackRef = useRef<HTMLDivElement | null>(null);

  // Update displayIndex when active changes; handle n-1 -> 0 wrap
  useEffect(() => {
    const n = slides.length;
    const prev = prevActiveRef.current;
    if (n === 0) return;

    if (prev === n - 1 && active === 0) {
      // move to the cloned first slide (index n) to keep motion leftward
      setDisplayIndex(n);
    } else {
      setDisplayIndex(active);
    }
    prevActiveRef.current = active;
  }, [active, slides.length]);

  // After landing on clone (index n), snap to real 0 without animation
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    const onEnd = () => {
      const n = slides.length;
      if (n > 0 && displayIndex === n) {
        setTxEnabled(false);
        setDisplayIndex(0);
        // re-enable transition on next frame (twice for safety)
        requestAnimationFrame(() => requestAnimationFrame(() => setTxEnabled(true)));
      }
    };

    el.addEventListener("transitionend", onEnd);
    return () => el.removeEventListener("transitionend", onEnd);
  }, [displayIndex, slides.length]);

  // --- spinner readiness ---
  const markReady = useCallback((): void => {
    setIsReady(true);
    sessionStorage.setItem("carouselReady", "1");
  }, []);
  const onLoad = useCallback(() => setImagesLoaded((n) => n + 1), []);
  const onError = onLoad;

  useEffect(() => {
    if (!isReady && slides.length > 0 && imagesLoaded >= slides.length) markReady();
  }, [imagesLoaded, isReady, slides.length, markReady]);

  useEffect(() => {
    if (isReady) return;
    timerRef.current = window.setTimeout(markReady, MAX_SPINNER_MS);
    return () => {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
        timerRef.current = null;
      }
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
        <div
          ref={trackRef}
          className="carousel-track"
          style={{
            transform: `translateX(-${displayIndex * 100}%)`,
            transition: txEnabled ? "transform 600ms ease-in-out" : "none",
            display: "flex",
            width: "100%",
          }}
        >
          {slidesPlus.map((image, i) => (
            <Slide
              key={i}
              src={`${backendImageUrl}${image.path}`}
              alt={`Car Image ${i + 1}`}
              isActive={i === active}           // a11y hook; style handled by track
              showOverlay={!isReady}
              eager={i === 0}
              onLoad={onLoad}
              onError={onError}
            />
          ))}
        </div>
      </div>

      {!isReady && (
        <div className="carousel-spinner">
          <LoadingSpinner message="Cars entering the starting line!" />
        </div>
      )}
    </div>
  );
}