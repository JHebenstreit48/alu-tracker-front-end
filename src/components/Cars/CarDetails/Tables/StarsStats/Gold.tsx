import { GoldMaxStats } from "@/components/Cars/CarDetails/Miscellaneous/Interfaces";

// Accept a broader car shape, not just GoldMaxStats
interface GoldMaxStatsProps {
  car: Partial<GoldMaxStats>; // or FullCar if you want full access
  unitPreference: "metric" | "imperial";
  trackerMode?: boolean;
}

const GoldMaxStatsTable: React.FC<GoldMaxStatsProps> = ({ car, unitPreference }) => {
  const safeParse = (value: unknown): number => {
    if (typeof value === "number") return value;
    return 0;
  };

  const convertTopSpeed = (value: unknown): string => {
    const speed = safeParse(value);
    const conversionFactor = 0.6214;
    return unitPreference === "imperial"
      ? `${(speed * conversionFactor).toFixed(1)} mph`
      : `${speed.toFixed(1)} km/h`;
  };

  const formatStat = (value: unknown): string => {
    return safeParse(value).toFixed(2);
  };

  return (

      <table className="carInfoTable">
        <thead>
          <tr>
            <th className="tableHeader2" colSpan={2}>Gold Max</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Rank</td>
            <td>{car.Gold_Max_Rank ?? "—"}</td>
          </tr>
          <tr>
            <td>Top Speed</td>
            <td>{convertTopSpeed(car.Gold_Top_Speed)}</td>
          </tr>
          <tr>
            <td>Acceleration</td>
            <td>{formatStat(car.Gold_Acceleration)}</td>
          </tr>
          <tr>
            <td>Handling</td>
            <td>{formatStat(car.Gold_Handling)}</td>
          </tr>
          <tr>
            <td>Nitro</td>
            <td>{formatStat(car.Gold_Nitro)}</td>
          </tr>
        </tbody>
      </table>
  );
};

export default GoldMaxStatsTable;