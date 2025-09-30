import { useEffect, useMemo, useRef, useState } from "react";

type UseCarouselOpts = {
  length: number;
  intervalMs?: number;    // default 2500
  pauseOnHover?: boolean; // default true
};

export function useCarousel({
  length,
  intervalMs = 2500,
  pauseOnHover = true,
}: UseCarouselOpts) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const last = useMemo(() => Math.max(0, length - 1), [length]);
  const intervalRef = useRef<number | null>(null);

  // auto-advance
  useEffect(() => {
    if (length <= 1 || paused) return;
    const id = window.setInterval(() => {
      setActive((i) => (i >= last ? 0 : i + 1));
    }, Math.max(1200, intervalMs));
    intervalRef.current = id;
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
  }, [length, last, paused, intervalMs]);

  // public API
  const prev = () => setActive((i) => (i <= 0 ? last : i - 1));
  const next = () => setActive((i) => (i >= last ? 0 : i + 1));

  // optional hover pause bindings
  const hoverProps = pauseOnHover
    ? {
        onMouseEnter: () => setPaused(true),
        onMouseLeave: () => setPaused(false),
      }
    : {};

  return { active, setActive, prev, next, hoverProps };
}