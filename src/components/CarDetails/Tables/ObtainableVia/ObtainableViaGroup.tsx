import React from 'react';
import type { ObtainableViaEntry } from '@/types/shared/car';
import ObtainableViaMethods from '@/components/CarDetails/Tables/ObtainableVia/ObtainableViaMethods';
import { formatStatus } from '@/utils/CarDetails/obtainableVia';

interface Props {
  group: ObtainableViaEntry;
  collapsible: boolean;
  isOpen: boolean;
  onToggle: () => void;
}

/** One status group: a status band (clickable if collapsible), then its methods when open. */
const ObtainableViaGroup: React.FC<Props> = ({ group, collapsible, isOpen, onToggle }) => {
  const showRemovedInfo =
    group.status === 'removed' && Boolean(group.removedDate || group.reason);
  const showMethods = !collapsible || isOpen;

  return (
    <>
      <tr>
        <td className={`obtainable-badge obtainable-${group.status}`}>
          {collapsible ? (
            <button
              type="button"
              className="obtainable-toggle"
              onClick={onToggle}
              aria-expanded={isOpen}
            >
              <span>{formatStatus(group.status)}</span>
              <span className="obtainable-toggle-count">({group.methods.length})</span>
              <span className="obtainable-toggle-arrow" aria-hidden="true">
                {isOpen ? '▾' : '▸'}
              </span>
            </button>
          ) : (
            formatStatus(group.status)
          )}
        </td>
      </tr>

      {showMethods && (
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
      )}
    </>
  );
};

export default ObtainableViaGroup;