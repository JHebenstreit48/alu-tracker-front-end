import { Car, Blueprints } from "@/components/CarInformation/CarDetails/Miscellaneous/Interfaces";
import StarRank from "@/components/CarInformation/CarDetails/OtherComponents/StarRank";

interface Props {
  car: Car & Blueprints;
  trackerMode?: boolean;
}

const BlueprintsTable: React.FC<Props> = ({ car }) => {
  if (car.Model.includes("Security")) {
    return <div className="noBlueprintData">No blueprint data available for security cars.</div>;
  }

  const blueprintEntries = Object.entries(car)
    .filter(
      ([key, value]) =>
        key.startsWith("BPs_") &&
        typeof value === "number" &&
        value !== null
    );

  if (blueprintEntries.length === 0) {
    return <div className="noBlueprintData">No blueprint data available.</div>;
  }

  const totalBlueprints = blueprintEntries.reduce(
    (sum, [, value]) => sum + (typeof value === "number" ? value : 0),
    0
  );

  return (

      <table className="carInfoTable">
        <thead>
          <tr>
            <th className="tableHeader2" colSpan={2}>Blueprints</th>
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
