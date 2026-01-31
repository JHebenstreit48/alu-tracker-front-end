import React, { useMemo } from "react";

import { Car } from "@/types/shared/car";
import { Blueprints } from "@/types/CarDetails";
import StarRank from "@/components/Shared/Stars/StarRank";

import {
  getBlueprintRows,
  sumNumericBlueprints,
} from "@/utils/CarDetails/getBlueprintRows";

import { useBlueprintTracker } from "@/hooks/CarDetails/useBlueprintTracker";

const BlueprintsTableTracker: React.FC<{ car: Car & Blueprints }> = ({ car }) => {
  if (car.Model.includes("Security")) {
    return (
      <div className="noBlueprintData">
        No blueprint data available for security cars.
      </div>
    );
  }

  const rows = useMemo(
    () => getBlueprintRows(car as unknown as Record<string, unknown>),
    [car]
  );

  if (rows.length === 0) {
    return <div className="noBlueprintData">No blueprint data available.</div>;
  }

  const isKeyCar = !!(car as any).KeyCar;

  const tracker = useBlueprintTracker({
    brand: car.Brand,
    model: car.Model,
    isKeyCar,
    rows,
  });

  const totalRequired = sumNumericBlueprints(rows);
  const remaining = Math.max(0, totalRequired - tracker.totalOwned);

  return (
    <table className="carInfoTable">
      <thead>
        <tr>
          <th className="tableHeader2" colSpan={4}>
            Blueprints
          </th>
        </tr>

        <tr className="trackerHeaderRow">
          <th>Stars</th>
          <th>Required</th>
          <th>Owned</th>
          <th>Input</th>
        </tr>
      </thead>

      <tbody>
        {rows.map((r) => {
          const star = r.star;
          const required = r.value;
          const owned = tracker.ownedByStar[star] ?? 0;

          const complete = star > 0 && star <= tracker.currentStars;
          const isTarget = !tracker.done && star === tracker.targetStar;
          const locked = !tracker.done && star > tracker.targetStar;

          return (
            <tr
              key={r.key}
              className={
                locked
                  ? "rowLocked"
                  : complete
                  ? "rowComplete"
                  : isTarget
                  ? "rowTarget"
                  : ""
              }
            >
              <td className="blueprintStarCell">
                <div className="starIconWrapper">
                  <StarRank count={star} />
                </div>
              </td>

              <td className="blueprintValueCell">{required}</td>

              <td className="blueprintOwnedCell">
                {typeof required === "number" ? `${owned}/${required}` : owned}
                {complete ? " ✓" : ""}
              </td>

              <td className="blueprintInputCell">
                {isTarget ? (
                  <input
                    type="number"
                    min={0}
                    inputMode="numeric"
                    value={owned}
                    onChange={(e) =>
                      tracker.updateOwnedForStar(star, Number(e.target.value))
                    }
                    aria-label={`Blueprints owned toward ${star} stars`}
                  />
                ) : (
                  <span>—</span>
                )}
              </td>
            </tr>
          );
        })}

        <tr>
          <td colSpan={4} className="blueprintTotalLabel">
            Stars left: {tracker.starsLeft} &nbsp;|&nbsp; Total owned:{" "}
            {tracker.totalOwned} &nbsp;|&nbsp; Remaining: {remaining}
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export default BlueprintsTableTracker;