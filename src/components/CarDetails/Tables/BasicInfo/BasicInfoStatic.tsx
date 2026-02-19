import React from 'react';
import { Car } from '@/types/shared/car';
import StarRankSelector from '@/components/CarDetails/OtherComponents/StarRankSelector';
import { formatAddedDate } from '@/utils/CarDetails/formatDate';

const BasicInfoStatic: React.FC<{ car: Car }> = ({ car }) => {
  const obtainableViaDisplay = Array.isArray(car.obtainableVia)
    ? car.obtainableVia.length
      ? car.obtainableVia.join(', ')
      : '—'
    : typeof car.obtainableVia === 'string' && car.obtainableVia.trim()
      ? car.obtainableVia.trim()
      : '—';

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

        {/* ✅ Added Date under Country */}
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
          <td>{obtainableViaDisplay}</td>
        </tr>
      </tbody>
    </table>
  );
};

export default BasicInfoStatic;