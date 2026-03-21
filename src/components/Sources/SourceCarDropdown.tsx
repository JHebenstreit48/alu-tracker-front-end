import { createPortal } from "react-dom";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import type { Car } from "@/types/shared/car";
import "@/scss/MiscellaneousStyle/Sources.scss";

type Props = {
  cars: Car[];
  onClose: () => void;
  anchorRef: React.RefObject<HTMLElement>;
};

export default function SourceCarDropdown({ cars, onClose, anchorRef }: Props) {
  const [style, setStyle] = useState<React.CSSProperties>({ visibility: "hidden" });
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!anchorRef.current || !dropdownRef.current) return;

    const anchor = anchorRef.current.getBoundingClientRect();
    const dropdown = dropdownRef.current.getBoundingClientRect();
    const footer = document.querySelector("footer")?.getBoundingClientRect();
    const viewportHeight = window.innerHeight;

    const top = anchor.bottom + 6;
    const left = anchor.left + anchor.width / 2;

    // Cap max-height so dropdown never overlaps footer
    const bottomLimit = footer ? footer.top - 8 : viewportHeight - 8;
    const availableHeight = bottomLimit - top;
    const maxHeight = Math.max(80, Math.min(288, availableHeight)); // 288px = 18rem

    setStyle({
      position: "fixed",
      top,
      left,
      transform: "translateX(-50%)",
      zIndex: 9999,
      maxHeight,
      visibility: "visible",
    });
  }, [anchorRef]);

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        anchorRef.current &&
        !anchorRef.current.contains(e.target as Node)
      ) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [onClose, anchorRef]);

  return createPortal(
    <div
      ref={dropdownRef}
      className="SourceCarDropdown"
      style={style}
      role="listbox"
      aria-label="Cars using this source"
    >
      <button
        className="SourceCarDropdown__close"
        onClick={onClose}
        aria-label="Close dropdown"
      >
        ✕
      </button>

      {cars.length === 0 ? (
        <p className="SourceCarDropdown__empty">No cars found for this source.</p>
      ) : (
        <ul className="SourceCarDropdown__list">
          {cars.map((car) => (
            <li key={car.normalizedKey} className="SourceCarDropdown__item">
              <Link
                to={`/cars/${car.normalizedKey}`}
                className="SourceCarDropdown__link"
                onClick={onClose}
              >
                {car.brand} {car.model}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>,
    document.body
  );
}