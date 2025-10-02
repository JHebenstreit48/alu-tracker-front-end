import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ImageCarouselType } from "@/components/HomePage/ImagesForCarousel";
import LoadingSpinner from "@/components/Shared/LoadingSpinner";
import { useCarousel } from "@/components/HomePage/Carousel/useCarousel";
import { Slide } from "@/components/HomePage/Carousel/Slide";

const backendImageUrl: string =
  import.meta.env.VITE_API_BASE_URL ?? "https://alutracker-api.onrender.com";

type Props = {
  project: ImageCarouselType[];
  intervalMs?: number;
  pauseOnHover?: boolean;
};

export default function ImageCarousel({
  project,
  intervalMs = 2500,
  pauseOnHover = true,
}: Props) {
  const slides = useMemo<ImageCarouselType[]>(
    () => project ?? [],
    [project]
  );

  // clone the first slide at the end for seamless wrap
  const slidesPlus = useMemo<ImageCarouselType[]>(
    () => (slides.length > 0 ? [...slides, slides[0]] : slides),
    [slides]
  );

  const [imagesLoaded, setImagesLoaded] = useState<number>(0);
  const [isReady, setIsReady] = useState<boolean>(
    () => sessionStorage.getItem("carouselReady") === "1"
  );

  const { active, setActive, hoverProps } = useCarousel({
    length: slides.length,
    intervalMs,
    pauseOnHover,
  });

  // --- seamless wrap state ---
  const prevActiveRef = useRef<number>(0);
  const [displayIndex, setDisplayIndex] = useState<number>(0); // index used for translateX
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

    const onEnd = (): void => {
      const n = slides.length;
      if (n > 0 && displayIndex === n) {
        setTxEnabled(false);
        setDisplayIndex(0);
        // re-enable transition on next frame (twice for safety)
        requestAnimationFrame(() =>
          requestAnimationFrame(() => setTxEnabled(true))
        );
      }
    };

    el.addEventListener("transitionend", onEnd);
    return () => el.removeEventListener("transitionend", onEnd);
  }, [displayIndex, slides.length]);

  // --- spinner readiness (wait for ALL images) ---
  const markReady = useCallback((): void => {
    setIsReady(true);
    sessionStorage.setItem("carouselReady", "1");
  }, []);

  const onLoad = useCallback((): void => {
    setImagesLoaded((n) => n + 1);
  }, []);

  const onError = onLoad;

  // Normal path: count loads/errors until all *real* slides are done
  useEffect(() => {
    if (!isReady && slides.length > 0 && imagesLoaded >= slides.length) {
      markReady();
    }
  }, [imagesLoaded, isReady, slides.length, markReady]);

  // Pre-flight cache check: ensure readiness if images are already cached
  useEffect(() => {
    if (isReady || slides.length === 0) return;

    let cancelled = false;

    const loadImage = (src: string): Promise<void> =>
      new Promise<void>((resolve) => {
        const img: HTMLImageElement = new Image();
        img.onload = () => resolve();
        img.onerror = () => resolve();
        img.src = src;

        // If already cached, complete may be true synchronously
        if (img.complete) {
          resolve();
          return;
        }

        // decode() exists on HTMLImageElement in modern browsers; call without type coercion
        if (typeof img.decode === "function") {
          img
            .decode()
            .then(() => resolve())
            .catch(() => resolve());
        }
      });

    const urls: string[] = slides.map((s) => `${backendImageUrl}${s.path}`);

    void Promise.all(urls.map(loadImage)).then(() => {
      if (!cancelled) {
        setImagesLoaded(slides.length); // sync counters with reality
        markReady();
      }
    });

    return () => {
      cancelled = true;
    };
  }, [isReady, slides, markReady]);

  if (slides.length === 0) return null;

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
              isActive={i === active} // a11y hook; style handled by track
              showOverlay={false}     // keep spinner stationary; no per-slide overlay
              eager={i === 0}
              onLoad={onLoad}
              onError={onError}
            />
          ))}
        </div>
      </div>

      {!isReady && (
        <div className="carousel-spinner" role="status" aria-live="polite" aria-busy="true">
          <LoadingSpinner message="Cars entering the starting line!" />
        </div>
      )}
    </div>
  );
}