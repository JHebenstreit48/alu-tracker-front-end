import React, { useEffect, useRef, useState } from 'react';
import { Car } from '@/types/shared/car';
import StarRankSelector from '@/components/CarDetails/OtherComponents/StarRankSelector';
import { useAutoSyncDependency } from '@/hooks/UserDataSync/useAutoSync';
import {
  generateCarKey,
  getCarTrackingData,
  setCarTrackingData,
} from '@/utils/shared/StorageUtils';
import { formatAddedDate } from '@/utils/CarDetails/formatDate';

const BasicInfoTracker: React.FC<{ car: Car; forceOwned?: boolean }> = ({ car, forceOwned }) => {
  const carKey = generateCarKey(car.brand, car.model);
  const hasUserInteracted = useRef(false);

  const [selectedStarRank, setSelectedStarRank] = useState<number>(0);
  const [owned, setOwned] = useState<boolean>(false);
  const [goldMaxed, setGoldMaxed] = useState<boolean>(false);

  useEffect(() => {
    const data = getCarTrackingData(carKey);
    setSelectedStarRank(typeof data.stars === 'number' ? data.stars : 0);
    setOwned(data.owned === true);
    setGoldMaxed(data.goldMaxed === true);
  }, [carKey]);

  // ✅ Only mark as owned if user manually selects star (for non-key cars)
  useEffect(() => {
    if (!car.keyCar && selectedStarRank > 0 && hasUserInteracted.current && !owned) {
      setOwned(true);
    }
  }, [car.keyCar, selectedStarRank, owned]);

  const handleStarSelect = (value: number) => {
    hasUserInteracted.current = true;
    setSelectedStarRank(value);
  };

  // ✅ Force owned logic (e.g. key car and key obtained)
  useEffect(() => {
    if (forceOwned && !owned) setOwned(true);
  }, [forceOwned, owned]);

  // ✅ Save to localStorage
  useEffect(() => {
    setCarTrackingData(carKey, { stars: selectedStarRank, owned, goldMaxed });
  }, [carKey, selectedStarRank, owned, goldMaxed]);

  // ✅ Sync if logged in
  useAutoSyncDependency([selectedStarRank, owned, goldMaxed]);

  const obtainableViaDisplay = Array.isArray(car.obtainableVia)
    ? car.obtainableVia.length
      ? car.obtainableVia.join(', ')
      : '—'
    : typeof car.obtainableVia === 'string' && car.obtainableVia.trim()
      ? car.obtainableVia.trim()
      : '—';

  return (
    <table className="carInfoTable basicInfoTable">
      <thead>
        <tr>
          <th className="tableHeader2" colSpan={2}>
            Class {car.class}
          </th>
        </tr>
      </thead>

      <tbody>
        <tr>
          <td colSpan={2} style={{ textAlign: 'center' }}>
            <StarRankSelector
              maxStars={car.stars}
              selected={selectedStarRank > 0 ? selectedStarRank : undefined}
              onSelect={handleStarSelect}
              brand={car.brand}
              model={car.model}
              trackerMode={true}
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

        <tr>
          <td style={{ textAlign: 'center' }}>
            <label>
              <input type="checkbox" checked={owned} onChange={(e) => setOwned(e.target.checked)} />{' '}
              Owned
            </label>
          </td>

          <td style={{ textAlign: 'center' }}>
            <label>
              <input
                type="checkbox"
                checked={goldMaxed}
                onChange={(e) => {
                  const isChecked = e.target.checked;
                  setGoldMaxed(isChecked);
                  if (isChecked) setSelectedStarRank(car.stars);
                }}
              />{' '}
              Gold Maxed
            </label>
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export default BasicInfoTracker;