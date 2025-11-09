import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ImageCarouselType } from "@/components/HomePage/ImagesForCarousel";
import LoadingSpinner from "@/components/Shared/Loading/LoadingSpinner";
import { useCarousel } from "@/components/HomePage/Carousel/useCarousel";
import { Slide } from "@/components/HomePage/Carousel/Slide";
import { getCarImageUrl } from "@/utils/imageUrl";

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

  const slidesPlus = useMemo<ImageCarouselType[]>(
    () => (slides.length > 0 ? [...slides, slides[0]] : slides),
    [slides]
  );

  const [imagesLoaded, setImagesLoaded] = useState(0);
  const [isReady, setIsReady] = useState(
    () => sessionStorage.getItem("carouselReady") === "1"
  );

  const { active, setActive, hoverProps } = useCarousel({
    length: slides.length,
    intervalMs,
    pauseOnHover,
  });

  const prevActiveRef = useRef(0);
  const [displayIndex, setDisplayIndex] = useState(0);
  const [txEnabled, setTxEnabled] = useState(true);
  const trackRef = useRef<HTMLDivElement | null>(null);

  // --- seamless wrap logic ---
  useEffect(() => {
    const n = slides.length;
    const prev = prevActiveRef.current;
    if (n === 0) return;

    if (prev === n - 1 && active === 0) {
      setDisplayIndex(n); // move to clone
    } else {
      setDisplayIndex(active);
    }

    prevActiveRef.current = active;
  }, [active, slides.length]);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    const onEnd = (): void => {
      const n = slides.length;
      if (n > 0 && displayIndex === n) {
        setTxEnabled(false);
        setDisplayIndex(0);
        requestAnimationFrame(() =>
          requestAnimationFrame(() => setTxEnabled(true))
        );
      }
    };

    el.addEventListener("transitionend", onEnd);
    return () => el.removeEventListener("transitionend", onEnd);
  }, [displayIndex, slides.length]);

  // --- loading state ---
  const markReady = useCallback(() => {
    setIsReady(true);
    sessionStorage.setItem("carouselReady", "1");
  }, []);

  const onLoad = useCallback(() => {
    setImagesLoaded((n) => n + 1);
  }, []);

  const onError = onLoad;

  useEffect(() => {
    if (!isReady && slides.length > 0 && imagesLoaded >= slides.length) {
      markReady();
    }
  }, [imagesLoaded, isReady, slides.length, markReady]);

  // Preload using Storage URLs
  useEffect(() => {
    if (isReady || slides.length === 0) return;

    let cancelled = false;

    const loadImage = (src: string): Promise<void> =>
      new Promise<void>((resolve) => {
        const img = new Image();
        img.onload = () => resolve();
        img.onerror = () => resolve();
        img.src = src;

        if (img.complete) {
          resolve();
          return;
        }

        if (typeof img.decode === "function") {
          img
            .decode()
            .then(() => resolve())
            .catch(() => resolve());
        }
      });

    const urls = slides.map((s) => getCarImageUrl(s.path));

    void Promise.all(urls.map(loadImage)).then(() => {
      if (!cancelled) {
        setImagesLoaded(slides.length);
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
              src={getCarImageUrl(image.path)}
              alt={`Car Image ${i + 1}`}
              isActive={i === active}
              showOverlay={false}
              eager={i === 0}
              onLoad={onLoad}
              onError={onError}
            />
          ))}
        </div>
      </div>

      {!isReady && (
        <div
          className="carousel-spinner"
          role="status"
          aria-live="polite"
          aria-busy="true"
        >
          <LoadingSpinner message="Cars entering the starting line!" />
        </div>
      )}
    </div>
  );
}