import React from 'react';
import type { ObtainableMethod } from '@/types/shared/car';
import {
  LEGACY_AREA,
  groupMethodsByArea,
  normalizeMethod,
} from '@/utils/CarDetails/obtainableVia';

interface Props {
  methods: ObtainableMethod[];
}

/** Methods grouped by area, two per row (one per row on phones). */
const ObtainableViaMethods: React.FC<Props> = ({ methods }) => {
  if (methods.length === 0) {
    return <div className="obtainable-methods-empty">—</div>;
  }

  const groups = groupMethodsByArea(methods.map((method) => normalizeMethod(method)));
  const showHeadings = !(groups.length === 1 && groups[0].area === LEGACY_AREA);

  return (
    <>
      {groups.map((group) => (
        <div key={group.area} className="obtainable-area">
          {showHeadings && <div className="obtainable-area-heading">{group.area}</div>}

          <div className="obtainable-methods-grid">
            {group.methods.map((method, i) => (
              <div key={`${i}-${method.section ?? ''}-${method.name}`} className="obtainable-method">
                {method.section && (
                  <span className="obtainable-method-section">{method.section}</span>
                )}
                <span className="obtainable-method-name">{method.name}</span>
                {method.dateLabel && (
                  <span className="obtainable-method-date">{method.dateLabel}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </>
  );
};

export default ObtainableViaMethods;