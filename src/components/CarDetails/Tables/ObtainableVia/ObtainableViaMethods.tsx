import React from 'react';
import type { ObtainableMethod } from '@/types/shared/car';
import { normalizeMethod } from '@/utils/CarDetails/obtainableVia';

interface Props {
  methods: ObtainableMethod[];
}

/** Methods two per row (one per row on phones): name, with dates underneath. */
const ObtainableViaMethods: React.FC<Props> = ({ methods }) => {
  if (methods.length === 0) {
    return <div className="obtainable-methods-empty">—</div>;
  }

  const normalized = methods.map((method) => normalizeMethod(method));

  return (
    <div className="obtainable-methods-grid">
      {normalized.map((method, i) => (
        <div key={`${i}-${method.name}`} className="obtainable-method">
          <span className="obtainable-method-name">{method.name}</span>
          {method.dateLabel && (
            <span className="obtainable-method-date">{method.dateLabel}</span>
          )}
        </div>
      ))}
    </div>
  );
};

export default ObtainableViaMethods;