import React from 'react';

import { Car } from '@/types/shared/car';
import { Blueprints } from '@/types/CarDetails';
import StarRank from '@/components/Shared/Stars/StarRank';

// Values can be number, string, or null after unwrapping
type BlueprintValue = number | string | null;

const BlueprintsTableStatic: React.FC<{ car: Car & Blueprints }> = ({ car }) => {
  if (car.model.includes('Security')) {
    return <div className="noBlueprintData">No blueprint data available for security cars.</div>;
  }

  // Extract relevant blueprint fields
  const blueprintEntries = (Object.entries(car) as [string, unknown][])
    .map(([key, value]): [string, BlueprintValue] => {
      const actualValue: BlueprintValue = Array.isArray(value)
        ? (value[0] as BlueprintValue)
        : (value as BlueprintValue);
      return [key, actualValue];
    })
    .filter(([key, value]) => {
      return (
        key.startsWith('BPs_') &&
        value !== null &&
        (typeof value === 'number' || typeof value === 'string')
      );
    });

  if (blueprintEntries.length === 0) {
    return <div className="noBlueprintData">No blueprint data available.</div>;
  }

  // 🔢 Sort by the numeric part in the key so rows are 1⭐, 2⭐, 3⭐, etc.
  const sortedEntries = [...blueprintEntries].sort(([keyA], [keyB]) => {
    const a = parseInt(keyA.match(/\d+/)?.[0] || '0', 10);
    const b = parseInt(keyB.match(/\d+/)?.[0] || '0', 10);
    return a - b;
  });

  const totalBlueprints = sortedEntries.reduce((sum, [, value]) => {
    if (typeof value === 'number') return sum + value;
    if (typeof value === 'string' && !isNaN(Number(value))) {
      return sum + Number(value);
    }
    return sum; // skip "unknown" / "?" strings
  }, 0);

  return (
    <table className="carInfoTable blueprintsTable">
      <thead>
        <tr>
          <th
            className="tableHeader2"
            colSpan={2}
          >
            Blueprints
          </th>
        </tr>
      </thead>
      <tbody>
        {sortedEntries.map(([key, value]) => {
          const starCount = parseInt(key.match(/\d+/)?.[0] || '0', 10);

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
          <td
            colSpan={2}
            className="blueprintTotalLabel"
          >
            Total Blueprints: {totalBlueprints}
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export default BlueprintsTableStatic;