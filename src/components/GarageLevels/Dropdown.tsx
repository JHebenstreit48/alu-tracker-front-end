import { useEffect, useMemo, useRef, useState } from "react";
import { GLContent } from "@/components/GarageLevels/Content";
import type { GarageLevelsInterface } from "@/interfaces/GarageLevels";
import "@/scss/GarageLevels/GarageLevels.scss";

interface GarageLevelsDropDownProps {
  levels: GarageLevelsInterface[];
}

export default function GarageLevelsDropDown({ levels }: GarageLevelsDropDownProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  // Ensure we have numeric, unique, sorted keys (future-proof if you add new levels)
  const sortedLevels = useMemo(() => {
    const keys = (levels ?? [])
      .map(l => l?.GarageLevelKey)
      .filter((n): n is number => Number.isFinite(n));
    const unique = Array.from(new Set(keys));
    unique.sort((a, b) => a - b);
    return unique;
  }, [levels]);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  function jumpToGarageLevel(levelKey: number) {
    const el = document.getElementById(`garage-level-${levelKey}`);
    if (!el) return;
  
    setOpen(false); // close dropdown first
  
    // --- Force instant scroll (bypasses smooth behavior globally) ---
    const root = (document.scrollingElement || document.documentElement) as HTMLElement;
    const prev = root.style.scrollBehavior;
    root.style.scrollBehavior = 'auto';
  
    // Option 1: reliable, instant jump
    el.scrollIntoView({ block: 'start' });
  
    // Restore previous scroll behavior
    root.style.scrollBehavior = prev;
  }  

  return (
    <div className="gl-container" ref={containerRef}>
      <button
        ref={buttonRef}
        type="button"
        className="gl-trigger"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen(v => !v)}
      >
        Select Garage Level
      </button>

      {/* Dropdown panel */}
      <div className={`gl-panel ${open ? "is-open" : ""}`} role="listbox" aria-label="Garage levels">
        <div className="gl-grid">
          {sortedLevels.length === 0 ? (
            <div className="gl-empty">No levels available</div>
          ) : (
            sortedLevels.map((k) => (
              <button
                key={k}
                type="button"
                role="option"
                aria-label={`Go to Garage Level ${k}`}
                className="gl-chip"
                onClick={() => jumpToGarageLevel(k)}
              >
                {k}
              </button>
            ))
          )}
        </div>
      </div>

      {/* Sections */}
      <div>
        {levels.map((level) =>
          Number.isFinite(level?.GarageLevelKey) ? (
            <div key={`level-${level.GarageLevelKey}`} id={`garage-level-${level.GarageLevelKey}`}>
              <GLContent
                GarageLevelKey={level.GarageLevelKey!}
                xp={level.xp}
                cars={level.cars}
              />
            </div>
          ) : (
            <div key={`level-missing`} className="warning">⚠️ Missing Garage Level Key.</div>
          )
        )}
      </div>
    </div>
  );
}