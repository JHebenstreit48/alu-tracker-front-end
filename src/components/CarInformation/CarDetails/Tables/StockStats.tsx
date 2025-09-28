import { StockStats as StockStatsData } from "@/components/CarInformation/CarDetails/Miscellaneous/Interfaces";

interface StockStatsProps {
  car: StockStatsData;
  unitPreference: "metric" | "imperial";
  trackerMode?: boolean;
}

const StockStats: React.FC<StockStatsProps> = ({ car, unitPreference }) => {
  // minimal change: accept numeric strings; return NaN for non-numeric so callers can decide
  const safeParse = (value: unknown): number => {
    if (typeof value === "number") return value;
    if (typeof value === "string" && value.trim() !== "" && !isNaN(Number(value))) {
      return Number(value);
    }
    return NaN; // <- instead of 0, so we can show "Unknown" instead of "0.00"
  };

  const convertTopSpeed = (value: unknown): string => {
    const speed = safeParse(value);
    if (!isNaN(speed)) {
      const conversionFactor = 0.6214;
      return unitPreference === "imperial"
        ? `${(speed * conversionFactor).toFixed(1)} mph`
        : `${speed.toFixed(1)} km/h`;
    }
    // if it's a string like "Unknown", show it; otherwise label Unknown
    return typeof value === "string" ? value : "Unknown";
  };

  const formatStat = (value: unknown): string => {
    const n = safeParse(value);
    if (!isNaN(n)) return n.toFixed(2);
    return typeof value === "string" ? value : "Unknown";
  };

  return (
    <table className="carInfoTable">
      <thead>
        <tr>
          <th className="tableHeader2" colSpan={2}>
            Stock
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Rank</td>
          {/* Keep original behavior: render whatever is there (number or string) */}
          <td>{car.Stock_Rank}</td>
        </tr>
        <tr>
          <td>Top Speed</td>
          <td>{convertTopSpeed(car.Stock_Top_Speed)}</td>
        </tr>
        <tr>
          <td>Acceleration</td>
          <td>{formatStat(car.Stock_Acceleration)}</td>
        </tr>
        <tr>
          <td>Handling</td>
          <td>{formatStat(car.Stock_Handling)}</td>
        </tr>
        <tr>
          <td>Nitro</td>
          <td>{formatStat(car.Stock_Nitro)}</td>
        </tr>
      </tbody>
    </table>
  );
};

export default StockStats;