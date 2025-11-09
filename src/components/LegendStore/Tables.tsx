import { useRef, useEffect } from "react";
import type {
  LegendStoreBlueprint,
  LegendStoreFilters,
} from "@/interfaces/LegendStore";
import { useLegendStoreBlueprints } from "@/hooks/LegendStore/useLegendStoreBlueprints";
import { filterBlueprints } from "@/utils/LegendStore/filterBlueprints";

interface Props {
  filters: LegendStoreFilters;
}

export default function Tables({ filters }: Props) {
  const { items, loading, error } = useLegendStoreBlueprints();
  const tableRef = useRef<HTMLTableElement | null>(null);

  const rows: LegendStoreBlueprint[] = filterBlueprints(items, filters);

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
  }, [rows.length, filters]);

  if (loading) return <p>Loading blueprints...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <table ref={tableRef} className="responsiveTable">
      <thead>
        <tr className="classSelectionHeader">
          <th colSpan={7}>
            {filters.selectedClass === "All Levels"
              ? "All Classes"
              : `Class ${filters.selectedClass}`}
          </th>
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
        {rows.length ? (
          rows.map((car) => {
            const cells: (number | null)[] = Array.from(
              { length: 5 },
              (_, i) => {
                const v = car.BlueprintPrices?.[i];
                return Number.isFinite(v) ? (v as number) : null;
              }
            );

            const total = cells.reduce<number>(
              (sum, n) => sum + (n ?? 0),
              0
            );

            return (
              <tr key={`${car.Brand}-${car.Model}-${car.StarRank}`}>
                <td>{`${car.Brand} ${car.Model}`}</td>
                {cells.map((v, i) => (
                  <td key={i}>{v !== null ? v.toLocaleString() : ""}</td>
                ))}
                <td>{total.toLocaleString()}</td>
              </tr>
            );
          })
        ) : (
          <tr>
            <td colSpan={7} className="no-results">
              No results found.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}