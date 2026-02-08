import React, { useMemo } from "react";

import { Car } from "@/types/shared/car";
import { Blueprints } from "@/types/CarDetails";
import StarRank from "@/components/Shared/Stars/StarRank";

import { getBlueprintRows, sumNumericBlueprints } from "@/utils/CarDetails/getBlueprintRows";

const BlueprintsTableStatic: React.FC<{ car: Car & Blueprints }> = ({ car }) => {
  // (Keep this check if you still want it, but note: you’re using `car.model` everywhere)
  if (car.model?.includes("Security")) {
    return <div className="noBlueprintData">No blueprint data available for security cars.</div>;
  }

  const rows = useMemo(() => getBlueprintRows(car as unknown as Record<string, unknown>), [car]);

  if (rows.length === 0) {
    return <div className="noBlueprintData">No blueprint data available.</div>;
  }

  const totalBlueprints = sumNumericBlueprints(rows);

  return (
    <table className="carInfoTable blueprintsTable">
      <thead>
        <tr>
          <th className="tableHeader2" colSpan={2}>
            Blueprints
          </th>
        </tr>
      </thead>

      <tbody>
        {rows.map((r) => (
          <tr key={r.key}>
            <td className="blueprintStarCell">
              <div className="starIconWrapper">
                <StarRank count={r.star} />
              </div>
            </td>
            <td className="blueprintValueCell">{r.value}</td>
          </tr>
        ))}

        <tr>
          <td colSpan={2} className="blueprintTotalLabel">
            Total Blueprints: {totalBlueprints}
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export default BlueprintsTableStatic;