import { useRef, useEffect, useState } from "react";
import type {
  LegendStoreBlueprint,
  LegendStoreFilters,
} from "@/types/LegendStore";
import { useLegendStoreBlueprints } from "@/hooks/LegendStore/useLegendStoreBlueprints";
import { filterBlueprints } from "@/utils/LegendStore/filterBlueprints";
import type { MobileView } from "./MobileViewToggle";

const CLASS_ORDER = ["D", "C", "B", "A", "S"] as const;

interface Props {
  filters: LegendStoreFilters;
  mobileView: MobileView;
}

interface ClassTableProps {
  className: string;
  rows: LegendStoreBlueprint[];
  mobileView: MobileView;
}

function CardView({ rows }: { rows: LegendStoreBlueprint[] }) {
  return (
    <div className="cardViewList">
      {rows.map((car) => {
        const prices = Array.from({ length: 5 }, (_, i) => {
          const v = car.BlueprintPrices?.[i];
          return Number.isFinite(v) ? (v as number) : null;
        });
        const total = prices.reduce<number>((sum, n) => sum + (n ?? 0), 0);

        return (
          <div
            key={`${car.Brand}-${car.Model}-${car.StarRank}`}
            className="carCard"
          >
            <div className="carCard__name">
              {car.Brand} {car.Model}
            </div>
            <div className="carCard__blueprints">
              {prices.map((v, i) =>
                v !== null ? (
                  <div key={i} className="carCard__bp">
                    <span className="carCard__bpLabel">BP{i + 1}</span>
                    <span className="carCard__bpVal">
                      {(v / 1000).toFixed(0)}k
                    </span>
                  </div>
                ) : null
              )}
            </div>
            <div className="carCard__total">
              <span>Total</span>
              <span>{total.toLocaleString()}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ExpandableView({ rows }: { rows: LegendStoreBlueprint[] }) {
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
        const prices = Array.from({ length: 5 }, (_, i) => {
          const v = car.BlueprintPrices?.[i];
          return Number.isFinite(v) ? (v as number) : null;
        });
        const total = prices.reduce<number>((sum, n) => sum + (n ?? 0), 0);

        return (
          <div
            key={key}
            className={`expandRow ${isOpen ? "expandRow--open" : ""}`}
          >
            <button className="expandRow__header" onClick={() => toggle(key)}>
              <span className="expandRow__name">
                {car.Brand} {car.Model}
              </span>
              <span className="expandRow__right">
                <span className="expandRow__total">
                  {total.toLocaleString()}
                </span>
                <span className="expandRow__chevron">▼</span>
              </span>
            </button>
            {isOpen && (
              <div className="expandRow__detail">
                {prices.map((v, i) =>
                  v !== null ? (
                    <div key={i} className="expandRow__cell">
                      <span className="expandRow__cellLabel">BP{i + 1}</span>
                      <span className="expandRow__cellVal">
                        {v.toLocaleString()}
                      </span>
                    </div>
                  ) : null
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function DesktopTable({
  className,
  rows,
}: {
  className: string;
  rows: LegendStoreBlueprint[];
}) {
  const tableRef = useRef<HTMLTableElement | null>(null);

  useEffect(() => {
    const table = tableRef.current;
    if (!table) return;
    const headerRow = table.querySelector<HTMLTableRowElement>(
      "thead tr.tableHeaderRow"
    );
    if (!headerRow) return;
    const headers = Array.from(
      headerRow.querySelectorAll<HTMLTableCellElement>("th")
    ).map((th) => th.textContent?.trim() ?? "");
    table.querySelectorAll<HTMLTableRowElement>("tbody tr").forEach((tr) => {
      tr.querySelectorAll<HTMLTableCellElement>("td").forEach((td, idx) => {
        if (!td.hasAttribute("data-label") && headers[idx]) {
          td.setAttribute("data-label", headers[idx]);
        }
      });
    });
  }, [rows.length]);

  return (
    <table ref={tableRef} className="responsiveTable">
      <thead>
        <tr className="classSelectionHeader">
          <th colSpan={7}>Class {className}</th>
        </tr>
        <tr className="tableHeaderRow">
          <th>Car</th>
          <th>Blueprint 1</th>
          <th>Blueprint 2</th>
          <th>Blueprint 3</th>
          <th>Blueprint 4</th>
          <th>Blueprint 5</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((car) => {
          const cells: (number | null)[] = Array.from(
            { length: 5 },
            (_, i) => {
              const v = car.BlueprintPrices?.[i];
              return Number.isFinite(v) ? (v as number) : null;
            }
          );
          const total = cells.reduce<number>((sum, n) => sum + (n ?? 0), 0);
          return (
            <tr key={`${car.Brand}-${car.Model}-${car.StarRank}`}>
              <td>{`${car.Brand} ${car.Model}`}</td>
              {cells.map((v, i) => (
                <td key={i}>{v !== null ? v.toLocaleString() : ""}</td>
              ))}
              <td>{total.toLocaleString()}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

function ClassTable({ className, rows, mobileView }: ClassTableProps) {
  return (
    <div className="classSection">
      <div className="classSection__desktop">
        <DesktopTable className={className} rows={rows} />
      </div>
      <div className="classSection__mobile">
        <div className="classSection__mobileOuter">
          <div className="classSection__mobileInner">
            <div className="classSection__mobileHeader">
              Class {className}
            </div>
            {mobileView === "card" ? (
              <CardView rows={rows} />
            ) : (
              <ExpandableView rows={rows} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Tables({ filters, mobileView }: Props) {
  const { items, loading, error } = useLegendStoreBlueprints();

  if (loading) return <p>Loading blueprints...</p>;
  if (error) return <p className="error">{error}</p>;

  const filteredItems = filterBlueprints(items, filters);

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
            <td colSpan={7} className="no-results">
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
          <ClassTable
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