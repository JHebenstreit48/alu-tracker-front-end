import { useState } from "react";

export type MobileView = "card" | "expandable";

interface Props {
  view: MobileView;
  onChange: (v: MobileView) => void;
}

export default function MobileViewToggle({ view, onChange }: Props) {
  return (
    <div className="mobileViewToggle">
      <button
        className={`toggleBtn ${view === "card" ? "active" : ""}`}
        onClick={() => onChange("card")}
      >
        Card View
      </button>
      <button
        className={`toggleBtn ${view === "expandable" ? "active" : ""}`}
        onClick={() => onChange("expandable")}
      >
        Expandable
      </button>
    </div>
  );
}