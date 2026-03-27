import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ImageCarouselType } from "@/data/ImagesForCarousel";
import { useCarousel } from "@/hooks/Home/useCarousel";
import { Slide } from "@/components/HomePage/Slide";
import { getCarImageUrl } from "@/utils/shared/imageUrl";

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

  useEffect(() => {
    const n = slides.length;
    const prev = prevActiveRef.current;
    if (n === 0) return;

    if (prev === n - 1 && active === 0) {
      setDisplayIndex(n);
    } else {
      setDisplayIndex(active);
    }

    prevActiveRef.current = active;
  }, [active, slides.length]);

  const displayIndexRef = useRef(displayIndex);
  useEffect(() => {
    displayIndexRef.current = displayIndex;
  }, [displayIndex]);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    const onEnd = (): void => {
      const n = slides.length;
      if (n > 0 && displayIndexRef.current === n) {
        setTxEnabled(false);
        setDisplayIndex(0);
        requestAnimationFrame(() =>
          requestAnimationFrame(() => setTxEnabled(true))
        );
      }
    };

    el.addEventListener("transitionend", onEnd);
    return () => el.removeEventListener("transitionend", onEnd);
  }, [slides.length]);

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

  useEffect(() => {
    if (isReady || slides.length === 0) return;

    let cancelled = false;

    const loadImage = (src: string): Promise<void> =>
      new Promise<void>((resolve) => {
        const img = new Image();
        img.onload = () => resolve();
        img.onerror = () => resolve();
        img.src = src;
        if (img.complete) resolve();
      });

    const timeout = window.setTimeout(() => {
      if (!cancelled) markReady();
    }, 4000);

    const urls = slides.map((s) => getCarImageUrl(s.path));
    void Promise.all(urls.map(loadImage)).then(() => {
      if (!cancelled) {
        window.clearTimeout(timeout);
        setImagesLoaded(slides.length);
        markReady();
      }
    });

    return () => {
      cancelled = true;
      window.clearTimeout(timeout);
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
              eager={i === 0}
              onLoad={onLoad}
              onError={onError}
            />
          ))}
        </div>
      </div>
    </div>
  );
}