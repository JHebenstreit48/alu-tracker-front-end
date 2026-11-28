import React from 'react';
import type { Car } from '@/types/shared/car';
import ObtainableViaGroup from '@/components/CarDetails/Tables/ObtainableVia/ObtainableViaGroup';
import ObtainableViaMethods from '@/components/CarDetails/Tables/ObtainableVia/ObtainableViaMethods';
import useCollapsedGroups, {
  isOpenByDefault,
} from '@/hooks/CarDetails/obtainableVia/useCollapsedGroups';
import {
  getAutoOpenStatus,
  getLegacyMethods,
  isGroupedObtainableVia,
  promoteStatus,
  sortObtainableGroups,
} from '@/utils/CarDetails/obtainableVia';

interface Props {
  obtainableVia: Car['obtainableVia'];
}

const ObtainableVia: React.FC<Props> = ({ obtainableVia }) => {
  const sorted = isGroupedObtainableVia(obtainableVia)
    ? sortObtainableGroups(obtainableVia)
    : null;
  const legacyMethods = isGroupedObtainableVia(obtainableVia)
    ? []
    : getLegacyMethods(obtainableVia);

  const autoOpenStatus = sorted ? getAutoOpenStatus(sorted) : null;
  const groups = sorted ? promoteStatus(sorted, autoOpenStatus) : null;

  const { isOpen, toggle } = useCollapsedGroups(autoOpenStatus);

  return (
    <table className="carInfoTable obtainableViaTable">
      <thead>
        <tr>
          <th className="tableHeader2">Obtainable Via</th>
        </tr>
      </thead>

      <tbody>
        {groups ? (
          groups.map((group, i) => {
            const key = `${group.status}-${i}`;
            const alwaysOpen =
              isOpenByDefault(group.status) || group.status === autoOpenStatus;
            return (
              <ObtainableViaGroup
                key={key}
                group={group}
                collapsible={!alwaysOpen}
                isOpen={isOpen(key, group.status)}
                onToggle={() => toggle(key, group.status)}
              />
            );
          })
        ) : (
          <tr>
            <td className="obtainable-methods-cell">
              <ObtainableViaMethods methods={legacyMethods} />
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default ObtainableVia;