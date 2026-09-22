import React from 'react';
import type { ObtainableViaEntry } from '@/types/shared/car';
import ObtainableViaMethods from '@/components/CarDetails/Tables/ObtainableVia/ObtainableViaMethods';
import { formatStatus } from '@/utils/CarDetails/obtainableVia';

interface Props {
  group: ObtainableViaEntry;
}

/** One status group: full-width status band, then its methods. */
const ObtainableViaGroup: React.FC<Props> = ({ group }) => {
  const showRemovedInfo =
    group.status === 'removed' && Boolean(group.removedDate || group.reason);

  return (
    <>
      <tr>
        <td className={`obtainable-badge obtainable-${group.status}`}>
          {formatStatus(group.status)}
        </td>
      </tr>

      <tr>
        <td className="obtainable-methods-cell">
          <ObtainableViaMethods methods={group.methods} />

          {showRemovedInfo && (
            <div className="obtainable-removed-info">
              {group.removedDate && (
                <span className="obtainable-removed-meta">Removed: {group.removedDate}</span>
              )}
              {group.reason && (
                <span className="obtainable-removed-meta">Reason: {group.reason}</span>
              )}
            </div>
          )}
        </td>
      </tr>
    </>
  );
};

export default ObtainableViaGroup;