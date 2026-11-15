import { useId } from "react";
import { useSourcesToggle } from "@/hooks/CarDetails/useSourcesToggle";

interface Props {
  sources?: string[];
}

export default function CarSources({ sources }: Props) {
  const { isOpen, toggle, containerRef } = useSourcesToggle();
  const panelId = useId();
  const list = (sources ?? []).map((s) => s.trim()).filter(Boolean);

  return (
    <div className="carSources" ref={containerRef}>
      <button
        type="button"
        className="sourcesButton"
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={toggle}
      >
        Sources{list.length > 0 && ` (${list.length})`}
        <span className="sourcesArrow" aria-hidden="true">{isOpen ? "▲" : "▼"}</span>
      </button>

      {isOpen && (
        <div id={panelId} className="sourcesPanel" role="region" aria-label="Data sources">
          {list.length === 0 ? (
            <p className="sourcesEmpty">No sources listed yet</p>
          ) : (
            <ul className="sourcesList">
              {list.map((name) => (
                <li key={name}>{name}</li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}