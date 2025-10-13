import { Car, Blueprints } from "@/components/CarInformation/CarDetails/Miscellaneous/Interfaces";
import StarRank from "@/components/Shared/Stars/StarRank";

interface Props {
  car: Car & Blueprints;
  trackerMode?: boolean;
}

// Values can be number, string, or null after unwrapping
type BlueprintValue = number | string | null;

const BlueprintsTable: React.FC<Props> = ({ car }) => {
  if (car.Model.includes("Security")) {
    return (
      <div className="noBlueprintData">
        No blueprint data available for security cars.
      </div>
    );
  }

  // Explicitly typecast Object.entries() to [string, unknown][]
  const blueprintEntries = (Object.entries(car) as [string, unknown][])
    .map(([key, value]): [string, BlueprintValue] => {
      const actualValue: BlueprintValue = Array.isArray(value)
        ? (value[0] as BlueprintValue)
        : (value as BlueprintValue);
      return [key, actualValue];
    })
    .filter(([key, value]) => {
      return (
        key.startsWith("BPs_") &&
        value !== null &&
        (typeof value === "number" || typeof value === "string")
      );
    });

  if (blueprintEntries.length === 0) {
    return (
      <div className="noBlueprintData">No blueprint data available.</div>
    );
  }

  const totalBlueprints = blueprintEntries.reduce((sum, [, value]) => {
    if (typeof value === "number") return sum + value;
    if (typeof value === "string" && !isNaN(Number(value))) {
      return sum + Number(value);
    }
    return sum; // skip "unknown" or "?" strings
  }, 0);

  return (
    <table className="carInfoTable">
      <thead>
        <tr>
          <th className="tableHeader2" colSpan={2}>
            Blueprints
          </th>
        </tr>
      </thead>
      <tbody>
        {blueprintEntries.map(([key, value]) => {
          const starCount = parseInt(key.match(/\d+/)?.[0] || "0", 10);

          return (
            <tr key={key}>
              <td className="blueprintStarCell">
                <div className="starIconWrapper">
                  <StarRank count={starCount} />
                </div>
              </td>
              <td className="blueprintValueCell">{value}</td>
            </tr>
          );
        })}

        <tr>
          <td colSpan={2} className="blueprintTotalLabel">
            Total Blueprints: {totalBlueprints}
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export default BlueprintsTable;