export type StoreView = "credits" | "tradeCoins";

interface Props {
  view: StoreView;
  onChange: (v: StoreView) => void;
}

export default function StoreViewToggle({ view, onChange }: Props) {
  return (
    <div className="storeViewToggle">
      <button
        className={`storeViewBtn ${view === "credits" ? "active" : ""}`}
        onClick={() => onChange("credits")}
      >
        Blueprint Credits
      </button>
      <button
        className={`storeViewBtn ${view === "tradeCoins" ? "active" : ""}`}
        onClick={() => onChange("tradeCoins")}
      >
        Trade Coins
      </button>
    </div>
  );
}