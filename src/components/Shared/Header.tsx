import { useEffect, useMemo, useRef } from "react";
import Navigation from "@/components/Shared/Navigation";
import AuthButtons from "@/components/SignupLogin/UI/AuthButtons";

interface HeaderProps {
  text: string;
  className?: string;
}

/**
 * Auto-fits the title ONLY on pages whose className contains "carDetailsHeader".
 * It gently reduces a CSS custom property (--fit-size) until the text fits
 * within its column, without touching other pages.
 */
export default function Header({ text, className }: HeaderProps) {
  const headerRef = useRef<HTMLElement | null>(null);
  const titleRef = useRef<HTMLHeadingElement | null>(null);

  const isCarDetails = useMemo(
    () => (className ?? "").includes("carDetailsHeader"),
    [className]
  );

  useEffect(() => {
    if (!isCarDetails) return;

    const headerEl = headerRef.current;
    const titleEl = titleRef.current;
    if (!headerEl || !titleEl) return;

    const fit = (): void => {
      // Clear previous override first so CSS clamps can apply
      titleEl.style.setProperty("--fit-size", "");

      // Available width proxy (title is in its own grid column)
      const targetW = titleEl.clientWidth || headerEl.clientWidth;

      const fitsNow =
        titleEl.scrollWidth <= targetW + 1 &&
        titleEl.scrollHeight <= titleEl.clientHeight + 1;

      if (fitsNow) return;

      const cs = window.getComputedStyle(titleEl);
      let size = parseFloat(cs.fontSize || "16");
      const floorPx = 10; // extra safety; main min/max live in SCSS variables
      let attempts = 10;

      while (attempts-- > 0) {
        titleEl.style.setProperty("--fit-size", `${size}px`);

        const widthOK = titleEl.scrollWidth <= targetW + 1;
        const heightOK = titleEl.scrollHeight <= titleEl.clientHeight + 1;

        if (widthOK && heightOK) break;

        size = Math.max(floorPx, size * 0.92);
        if (size <= floorPx) break;
      }
    };

    // Run once immediately
    fit();

    // Re-run on layout changes
    const ro = new ResizeObserver(() => fit());
    ro.observe(headerEl);
    ro.observe(titleEl);

    // Also re-run shortly after mount or when text changes
    const timeoutId = window.setTimeout(fit, 0);

    return () => {
      ro.disconnect();
      window.clearTimeout(timeoutId);
    };
  }, [isCarDetails, text]);

  return (
    <header className={`Header ${className || ""}`} role="banner" ref={headerRef}>
      <div className="Header__inner">
        {/* center column */}
        <h1 className="PageHeader" title={text} ref={titleRef}>
          {text}
        </h1>

        {/* right column */}
        <div className="Header__auth">
          <AuthButtons />
        </div>
      </div>

      <div className="Header__navRow" role="presentation">
        <Navigation />
      </div>
    </header>
  );
}