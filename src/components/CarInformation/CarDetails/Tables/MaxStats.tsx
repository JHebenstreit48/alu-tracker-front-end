import { Car } from "@/components/CarInformation/CarDetails/Miscellaneous/CarInterfaces";

interface MaxStatsProps {
  car: Car;
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
              Gold Max Stats
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Top Speed</td>
            <td>{convertTopSpeed(car.Top_Speed)}</td>
          </tr>
          <tr>
            <td>Acceleration</td>
            <td>{formatStat(car.Acceleration)}</td>
          </tr>
          <tr>
            <td>Handling</td>
            <td>{formatStat(car.Handling)}</td>
          </tr>
          <tr>
            <td>Nitro</td>
            <td>{formatStat(car.Nitro)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default MaxStats;
