import React from 'react';
import type { Car } from '@/types/shared/car';
import ObtainableViaGroup from '@/components/CarDetails/Tables/ObtainableVia/ObtainableViaGroup';
import ObtainableViaMethods from '@/components/CarDetails/Tables/ObtainableVia/ObtainableViaMethods';
import {
  getLegacyMethods,
  isGroupedObtainableVia,
  sortObtainableGroups,
} from '@/utils/CarDetails/obtainableVia';

interface Props {
  obtainableVia: Car['obtainableVia'];
}

const ObtainableVia: React.FC<Props> = ({ obtainableVia }) => {
  return (
    <table className="carInfoTable obtainableViaTable">
      <thead>
        <tr>
          <th className="tableHeader2">Obtainable Via</th>
        </tr>
      </thead>

      <tbody>
        {isGroupedObtainableVia(obtainableVia) ? (
          sortObtainableGroups(obtainableVia).map((group, i) => (
            <ObtainableViaGroup key={`${group.status}-${i}`} group={group} />
          ))
        ) : (
          <tr>
            <td className="obtainable-methods-cell">
              <ObtainableViaMethods methods={getLegacyMethods(obtainableVia)} />
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default ObtainableVia;