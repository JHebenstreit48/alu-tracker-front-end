import { useEffect, useMemo, useRef, useState } from "react";
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
  const slides = useMemo<ImageCarouselType[]>(() => project ?? [], [project]);

  const slidesPlus = useMemo<ImageCarouselType[]>(
    () => (slides.length > 0 ? [...slides, slides[0]] : slides),
    [slides]
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

  // NEW: only preload the upcoming slide, not all 26
  useEffect(() => {
    if (slides.length <= 1) return;
    const nextIndex = (active + 1) % slides.length;
    const img = new Image();
    img.src = getCarImageUrl(slides[nextIndex].path);
  }, [active, slides]);

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
              alt={image.name}
              isActive={i === active}
              eager={i === 0}
            />
          ))}
        </div>
      </div>
    </div>
  );
}