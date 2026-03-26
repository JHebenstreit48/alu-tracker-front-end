import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type UseCarouselOpts = {
  length: number;
  intervalMs?: number;
  pauseOnHover?: boolean;
};

export function useCarousel({
  length,
  intervalMs = 2500,
  pauseOnHover = true,
}: UseCarouselOpts) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const last = useMemo(() => Math.max(0, length - 1), [length]);

  const pausedRef = useRef(paused);
  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  // Auto-advance with tab visibility reset
  useEffect(() => {
    if (length <= 1) return;

    let id: number;

    const start = () => {
      id = window.setInterval(() => {
        if (pausedRef.current) return;
        setActive((i) => (i >= last ? 0 : i + 1));
      }, Math.max(1200, intervalMs));
    };

    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        // Tab came back into focus — clear old stale interval and
        // start a fresh one so it doesn't fire immediately
        window.clearInterval(id);
        start();
      } else {
        // Tab hidden — clear interval entirely to avoid throttled catchup
        window.clearInterval(id);
      }
    };

    document.addEventListener("visibilitychange", onVisibilityChange);
    start();

    return () => {
      window.clearInterval(id);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [length, last, intervalMs]);

  const prev = useCallback(
    () => setActive((i) => (i <= 0 ? last : i - 1)),
    [last]
  );

  const next = useCallback(
    () => setActive((i) => (i >= last ? 0 : i + 1)),
    [last]
  );

  const hoverProps = pauseOnHover
    ? {
        onMouseEnter: () => setPaused(true),
        onMouseLeave: () => setPaused(false),
      }
    : {};

  return { active, setActive, prev, next, hoverProps };
}