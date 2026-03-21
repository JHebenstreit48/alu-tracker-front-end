import { useState, useRef } from "react";
import { useSourceCars } from "@/hooks/sources/useSourceCars";
import SourceCarDropdown from "./SourceCarDropdown";
import type { Car } from "@/types/shared/car";
import "@/scss/MiscellaneousStyle/Sources.scss";

type Props = {
  label: string;
  count: number;
  cars: Array<Car & Record<string, unknown>>;
  onOpenChange?: (open: boolean) => void;
};

export default function SourcePill({ label, count, cars, onOpenChange }: Props) {
  const [open, setOpen] = useState(false);
  const matchedCars = useSourceCars(cars, label);
  const buttonRef = useRef<HTMLButtonElement>(null);

  function toggle() {
    const next = !open;
    setOpen(next);
    onOpenChange?.(next);
  }

  return (
    <li className="SourcesPage__pill">
      <button
        ref={buttonRef}
        className="SourcesPage__pillButton"
        onClick={toggle}
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <span className="SourcesPage__pillLabel">{label}</span>
        <span className="SourcesPage__pillCount" aria-label={`Used by ${count} cars`}>
          {count}
        </span>
      </button>

      {open && (
        <SourceCarDropdown
          cars={matchedCars}
          onClose={() => { setOpen(false); onOpenChange?.(false); }}
          anchorRef={buttonRef}
        />
      )}
    </li>
  );
}