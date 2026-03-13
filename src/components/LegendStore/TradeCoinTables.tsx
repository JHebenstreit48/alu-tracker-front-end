import { useRef, useEffect, useState } from "react";
import type {
  LegendStoreTradeCoin,
  LegendStoreFilters,
} from "@/types/LegendStore";
import { useLegendStoreTradeCoins } from "@/hooks/LegendStore/useLegendStoreTradeCoins";
import { filterTradeCoins } from "@/utils/LegendStore/filterTradeCoins";
import type { MobileView } from "./MobileViewToggle";

const CLASS_ORDER = ["D", "C", "B", "A", "S"] as const;

interface Props {
  filters: LegendStoreFilters;
  mobileView: MobileView;
}

interface ClassTableProps {
  className: string;
  rows: LegendStoreTradeCoin[];
  mobileView: MobileView;
}

function TCCardView({ rows }: { rows: LegendStoreTradeCoin[] }) {
  return (
    <div className="cardViewList">
      {rows.map((car) => (
        <div
          key={`${car.Brand}-${car.Model}-${car.StarRank}`}
          className="carCard"
        >
          <div className="carCard__name">
            {car.Brand} {car.Model}
          </div>
          <div className="carCard__total">
            <span>Trade Coins</span>
            <span>{car.TradeCoinCost.toLocaleString()}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function TCExpandableView({ rows }: { rows: LegendStoreTradeCoin[] }) {
  const [openKeys, setOpenKeys] = useState<Set<string>>(new Set());

  const toggle = (key: string) =>
    setOpenKeys((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });

  return (
    <div className="expandableList">
      {rows.map((car) => {
        const key = `${car.Brand}-${car.Model}-${car.StarRank}`;
        const isOpen = openKeys.has(key);

        return (
          <div
            key={key}
            className={`expandRow ${isOpen ? "expandRow--open" : ""}`}
          >
            <button
              className="expandRow__header"
              onClick={() => toggle(key)}
            >
              <span className="expandRow__name">
                {car.Brand} {car.Model}
              </span>
              <span className="expandRow__right">
                <span className="expandRow__total">
                  {car.TradeCoinCost.toLocaleString()}
                </span>
                <span className="expandRow__chevron">▼</span>
              </span>
            </button>
            {isOpen && (
              <div className="expandRow__detail expandRow__detail--tc">
                <div className="expandRow__cell">
                  <span className="expandRow__cellLabel">Daily Limit</span>
                  <span className="expandRow__cellVal">{car.DailyLimit}</span>
                </div>
                <div className="expandRow__cell">
                  <span className="expandRow__cellLabel">Rarity</span>
                  <span className="expandRow__cellVal">{car.CarRarity}</span>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function TCDesktopTable({
  className,
  rows,
}: {
  className: string;
  rows: LegendStoreTradeCoin[];
}) {
  return (
    <table className="responsiveTable responsiveTable--tc">
      <thead>
        <tr className="classSelectionHeader">
          <th colSpan={4}>Class {className}</th>
        </tr>
        <tr className="tableHeaderRow">
          <th>Car</th>
          <th>Rarity</th>
          <th>Trade Coin Cost</th>
          <th>Daily Limit</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((car) => (
          <tr key={`${car.Brand}-${car.Model}-${car.StarRank}`}>
            <td>{`${car.Brand} ${car.Model}`}</td>
            <td>{car.CarRarity}</td>
            <td>{car.TradeCoinCost.toLocaleString()}</td>
            <td>{car.DailyLimit}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function TCClassTable({ className, rows, mobileView }: ClassTableProps) {
  return (
    <div className="classSection">
      <div className="classSection__desktop">
        <TCDesktopTable className={className} rows={rows} />
      </div>
      <div className="classSection__mobile">
        <div className="classSection__mobileOuter">
          <div className="classSection__mobileInner">
            <div className="classSection__mobileHeader">
              Class {className}
            </div>
            {mobileView === "card" ? (
              <TCCardView rows={rows} />
            ) : (
              <TCExpandableView rows={rows} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TradeCoinTables({ filters, mobileView }: Props) {
  const { items, loading, error } = useLegendStoreTradeCoins();

  if (loading) return <p>Loading Trade Coin data...</p>;
  if (error) return <p className="error">{error}</p>;

  const filteredItems = filterTradeCoins(items, filters);

  const byClass = Object.fromEntries(
    CLASS_ORDER.map((cls) => [
      cls,
      filteredItems.filter((car) => car.Class === cls),
    ])
  );

  const hasAnyResults = CLASS_ORDER.some((cls) => byClass[cls].length > 0);

  if (!hasAnyResults) {
    return (
      <table className="responsiveTable">
        <tbody>
          <tr>
            <td colSpan={4} className="no-results">
              No results found.
            </td>
          </tr>
        </tbody>
      </table>
    );
  }

  return (
    <>
      {CLASS_ORDER.map((cls) => {
        const rows = byClass[cls];
        if (!rows.length) return null;
        return (
          <TCClassTable
            key={cls}
            className={cls}
            rows={rows}
            mobileView={mobileView}
          />
        );
      })}
    </>
  );
}