export type StoreView = "credits" | "tradeCoins" | "imports";

interface Props {
  view: StoreView;
  onChange: (v: StoreView) => void;
}

export default function StoreViewToggle({ view, onChange }: Props) {
  const blueprintValue = view === "imports" ? "credits" : view;

  return (
    <div className="storeViewToggle">
      <div className="storeViewGroup">
        <label className="storeViewGroup__label" htmlFor="blueprintSelect">
          Blueprints
        </label>
        <select
          id="blueprintSelect"
          className={`storeViewSelect ${view !== "imports" ? "active" : ""}`}
          value={blueprintValue}
          onChange={(e) => onChange(e.target.value as StoreView)}
        >
          <option value="credits">Credits</option>
          <option value="tradeCoins">Trade Coins</option>
        </select>
      </div>
      <button
        className={`storeViewBtn ${view === "imports" ? "active" : ""}`}
        onClick={() => onChange("imports")}
      >
        Imports
      </button>
    </div>
  );
}