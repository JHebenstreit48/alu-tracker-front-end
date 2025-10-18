import { useEffect, useRef, useState } from "react";

// ✅ Use env-based backend URL
const API_BASE_URL =
  import.meta.env.VITE_CONTENT_API_BASE_URL ?? "https://alutracker-api.onrender.com";

interface BlueprintCar {
  Class: string;
  Brand: string;
  Model: string;
  GarageLevel?: number;
  StarRank: number;
  CarRarity: string;
  BlueprintPrices: number[]; // may be < 5; we’ll pad
}

const Tables: React.FC<{
  selectedClass: string;
  selectedCarRarity: string | null;
  searchTerm: string;
  selectedCumulativeLevel: number | null;
  selectedIndividualLevel: number | null;
  selectedStarRank: number | null;
}> = ({
  selectedClass,
  selectedCarRarity,
  searchTerm,
  selectedCumulativeLevel,
  selectedIndividualLevel,
  selectedStarRank,
}) => {
  const [cars, setCars] = useState<BlueprintCar[]>([]);
  const [loading, setLoading] = useState(true);

  const tableRef = useRef<HTMLTableElement | null>(null);

  useEffect(() => {
    const fetchCars = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}/api/blueprints`);
        const data = await response.json();
        setCars(data);
      } catch (err) {
        console.error("Error fetching blueprint data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, []);

  // Filters
  let filteredCars =
    selectedClass === "All Levels"
      ? cars
      : cars.filter((car) => car.Class === selectedClass);

  if (selectedCarRarity !== null) {
    filteredCars = filteredCars.filter(
      (car) => car.CarRarity === selectedCarRarity
    );
  }

  if (searchTerm.trim() !== "") {
    const q = searchTerm.toLowerCase();
    filteredCars = filteredCars.filter((car) =>
      `${car.Brand} ${car.Model}`.toLowerCase().includes(q)
    );
  }

  if (selectedCumulativeLevel !== null) {
    filteredCars = filteredCars.filter(
      (car) =>
        car.GarageLevel !== undefined &&
        car.GarageLevel <= selectedCumulativeLevel
    );
  }

  if (selectedIndividualLevel !== null) {
    filteredCars = filteredCars.filter(
      (car) =>
        car.GarageLevel !== undefined &&
        car.GarageLevel === selectedIndividualLevel
    );
  }

  if (selectedStarRank !== null) {
    filteredCars = filteredCars.filter(
      (car) => car.StarRank === selectedStarRank
    );
  }

  // Optional: stable order
  filteredCars = [...filteredCars].sort((a, b) => {
    const A = `${a.Brand} ${a.Model}`.toLowerCase();
    const B = `${b.Brand} ${b.Model}`.toLowerCase();
    return A < B ? -1 : A > B ? 1 : 0;
  });

  // 🏷️ Copy thead labels to td[data-label] for mobile cards
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
  }, [
    filteredCars.length,
    selectedClass,
    selectedCarRarity,
    searchTerm,
    selectedCumulativeLevel,
    selectedIndividualLevel,
    selectedStarRank,
  ]);

  return (
    <div>
      {loading ? (
        <p>Loading blueprints...</p>
      ) : (
        <table ref={tableRef} className="responsiveTable">
          <thead>
            <tr className="classSelectionHeader">
              <th colSpan={7}>
                {selectedClass === "All Levels"
                  ? "All Classes"
                  : `Class ${selectedClass}`}
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
            {filteredCars.length > 0 ? (
              filteredCars.map((car) => {
                // Always render 5 blueprint cells (pad with nulls)
                const bp: (number | null)[] = Array.from({ length: 5 }, (_, i) => {
                  const v = car.BlueprintPrices?.[i];
                  return Number.isFinite(v) ? (v as number) : null;
                });

                // ✅ Tell TS the accumulator is a number
                const total = bp.reduce<number>(
                  (sum, n) => sum + (n ?? 0),
                  0
                );

                return (
                  <tr key={`${car.Brand}-${car.Model}`}>
                    <td>{`${car.Brand} ${car.Model}`}</td>

                    {bp.map((price, i) => (
                      <td key={i}>{price !== null ? price.toLocaleString() : ""}</td>
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
      )}
    </div>
  );
};

export default Tables;