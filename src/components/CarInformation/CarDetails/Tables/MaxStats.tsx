import { Car, GoldMaxStats } from "@/components/CarInformation/CarDetails/Miscellaneous/Interfaces";

interface MaxStatsProps {
  car: Car & GoldMaxStats;
  unitPreference: "metric" | "imperial";
  trackerMode?: boolean;
}

const MaxStats: React.FC<MaxStatsProps> = ({ car, unitPreference }) => {
  const safeParse = (value: unknown): number => {
    if (typeof value === "number") return value;
    if (typeof value === "string") return parseFloat(value.replace(",", "."));
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
    <div className="carDetailTables">
      <table className="carInfoTable">
        <thead>
          <tr>
            <th className="tableHeader2" colSpan={2}>
              Gold Max
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Rank</td>
            <td>{car.Max_Rank}</td>
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
    </div>
  );
};

export default MaxStats;
