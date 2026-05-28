import React from 'react';
import { Car, ObtainableViaEntry } from '@/types/shared/car';
import StarRankSelector from '@/components/CarDetails/OtherComponents/StarRankSelector';
import { formatAddedDate } from '@/utils/CarDetails/formatDate';

const SHORT_METHOD_THRESHOLD = 20;

function renderObtainableVia(obtainableVia: Car['obtainableVia']) {
  if (!obtainableVia || (Array.isArray(obtainableVia) && obtainableVia.length === 0)) {
    return <span>—</span>;
  }

  if (
    Array.isArray(obtainableVia) &&
    obtainableVia.length > 0 &&
    typeof obtainableVia[0] === 'object' &&
    obtainableVia[0] !== null &&
    'methods' in obtainableVia[0]
  ) {
    return (
      <div className="obtainable-list">
        {(obtainableVia as ObtainableViaEntry[]).map((group, i) => {
          const allShort = group.methods.every(
            (m) => m.length <= SHORT_METHOD_THRESHOLD
          );

          return (
            <div
              key={i}
              className={`obtainable-group${i > 0 ? ' obtainable-group--bordered' : ''}`}
            >
              <div className="obtainable-status-label">
                <span className={`obtainable-badge obtainable-${group.status}`}>
                  {group.status.charAt(0).toUpperCase() + group.status.slice(1)}
                </span>
              </div>
              <div className={`obtainable-methods${allShort ? ' obtainable-methods--inline' : ''}`}>
                {allShort ? (
                  <span className="obtainable-method-item">
                    {group.methods.join(' | ')}
                  </span>
                ) : (
                  group.methods.map((method, j) => (
                    <span key={j} className="obtainable-method-item">
                      {method}
                    </span>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  if (Array.isArray(obtainableVia)) {
    return <span>{obtainableVia.join(', ')}</span>;
  }

  if (typeof obtainableVia === 'string') {
    return <span>{obtainableVia.trim() || '—'}</span>;
  }

  return <span>—</span>;
}

const BasicInfoStatic: React.FC<{ car: Car }> = ({ car }) => {
  return (
    <table className='carInfoTable basicInfoTable'>
      <thead>
        <tr>
          <th className='tableHeader2' colSpan={2}>
            Class {car.class}
          </th>
        </tr>
      </thead>

      <tbody>
        <tr>
          <td colSpan={2} style={{ textAlign: 'center' }}>
            <StarRankSelector
              maxStars={car.stars}
              selected={car.stars}
              brand={car.brand}
              model={car.model}
              trackerMode={false}
              isKeyCar={car.keyCar}
            />
          </td>
        </tr>

        <tr>
          <td colSpan={2}>{car.country}</td>
        </tr>

        {car.addedDate && (
          <tr>
            <td>Added</td>
            <td>{formatAddedDate(car.addedDate, 'locale')}</td>
          </tr>
        )}

        <tr>
          <td>Rarity</td>
          <td>{car.rarity}</td>
        </tr>

        <tr>
          <td>Obtainable Via</td>
          <td
            id="obtainable-cell"
            className="obtainable-cell"
            style={{ padding: 0, verticalAlign: 'top' }}
          >
            {renderObtainableVia(car.obtainableVia)}
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export default BasicInfoStatic;