import React, { useMemo } from 'react';

import { Car } from '@/types/shared/car';
import { Blueprints } from '@/types/CarDetails';
import StarRank from '@/components/Shared/Stars/StarRank';

import { getBlueprintRows, sumNumericBlueprints } from '@/utils/CarDetails/getBlueprintRows';
import { useBlueprintTracker } from '@/hooks/CarDetails/useBlueprintTracker';

const BlueprintsTableTracker: React.FC<{ car: Car & Blueprints }> = ({ car }) => {
  if (car.model.includes('Security')) {
    return <div className="noBlueprintData">No blueprint data available for security cars.</div>;
  }

  const rows = useMemo(() => getBlueprintRows(car as unknown as Record<string, unknown>), [car]);

  if (rows.length === 0) {
    return <div className="noBlueprintData">No blueprint data available.</div>;
  }

  const isKeyCar = !!car.keyCar;

  const tracker = useBlueprintTracker({
    brand: car.brand,
    model: car.model,
    isKeyCar,
    rows,
  });

  const totalRequired = sumNumericBlueprints(rows);
  const remaining = Math.max(0, totalRequired - tracker.totalOwned);

  /**
   * Non-key cars: editableStar remains tracker.targetStar (unchanged).
   * Key cars: pick the first star row with required > 0 that is not yet met.
   * (This naturally skips 1★ when blueprints1Star = 0.)
   */
  const editableStar = useMemo(() => {
    if (!isKeyCar) return tracker.targetStar;
    if (tracker.done) return tracker.targetStar;

    for (const r of rows) {
      const required = r.value;
      const owned = tracker.ownedByStar[r.star] ?? 0;

      if (typeof required === 'number' && required > 0 && owned < required) {
        return r.star;
      }
    }

    // If everything is met (or data is weird), fall back to hook value
    return tracker.targetStar;
  }, [isKeyCar, tracker.done, tracker.targetStar, tracker.ownedByStar, rows]);

  return (
    <table className="carInfoTable blueprintsTable">
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

          const isEditableRow = !tracker.done && star === editableStar;

          // Lock rows only *after* the computed editable star (works even if 1★ requires 0)
          const isLockedRow = !tracker.done && star > editableStar;

          const metRequirement = typeof required === 'number' ? owned >= required : false;

          return (
            <tr
              key={r.key}
              className={isLockedRow ? 'rowLocked' : metRequirement ? 'rowComplete' : ''}
            >
              <td className="blueprintStarCell">
                <div className="starIconWrapper">
                  <StarRank count={star} />
                </div>
              </td>

              <td className="blueprintValueCell">{required}</td>

              <td className="blueprintOwnedCell">
                {typeof required === 'number' ? `${owned}/${required}` : owned}
                {metRequirement ? ' ✓' : ''}
              </td>

              <td className="blueprintInputCell">
                {isEditableRow ? (
                  <input
                    type="number"
                    min={0}
                    inputMode="numeric"
                    value={owned}
                    onChange={(e) => tracker.updateOwnedForStar(star, Number(e.target.value))}
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
            Stars left: {tracker.starsLeft} &nbsp;|&nbsp; Total owned: {tracker.totalOwned}
            &nbsp;|&nbsp; Remaining: {remaining}
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export default BlueprintsTableTracker;