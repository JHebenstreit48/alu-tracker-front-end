import React, { useEffect, useRef, useState } from 'react';
import type { Car } from '@/types/shared/car';
import StarRankSelector from '@/components/CarDetails/widgets/StarRankSelector';
import { useAutoSyncDependency } from '@/hooks/UserDataSync/useAutoSync';
import {
  generateCarKey,
  getCarTrackingData,
  setCarTrackingData,
} from '@/utils/shared/StorageUtils';
import { formatAddedDate } from '@/utils/CarDetails/formatDate';
import { notifyCarTrackingChanged, onCarTrackingChanged } from '@/utils/CarDetails/carTrackingEvents';

const BasicInfoTracker: React.FC<{ car: Car; forceOwned?: boolean }> = ({ car, forceOwned }) => {
  const carKey = generateCarKey(car.brand, car.model);
  const hasUserInteracted = useRef(false);
  // Set by your clicks so only real changes are announced to the Blueprints table
  const userChanged = useRef(false);

  // Start from saved values so the first save never writes blanks over them
  const [selectedStarRank, setSelectedStarRank] = useState<number>(() => {
    const stars = getCarTrackingData(carKey).stars;
    return typeof stars === 'number' ? stars : 0;
  });
  const [owned, setOwned] = useState<boolean>(() => getCarTrackingData(carKey).owned === true);
  const [goldMaxed, setGoldMaxed] = useState<boolean>(
    () => getCarTrackingData(carKey).goldMaxed === true
  );

  // Load on car change, and re-load when the Blueprints table changes the star rank
  useEffect(() => {
    const load = () => {
      const data = getCarTrackingData(carKey);
      setSelectedStarRank(typeof data.stars === 'number' ? data.stars : 0);
      setOwned(data.owned === true);
      setGoldMaxed(data.goldMaxed === true);
    };
    load();
    return onCarTrackingChanged(carKey, 'basicInfo', load);
  }, [carKey]);

  useEffect(() => {
    if (!car.keyCar && selectedStarRank > 0 && hasUserInteracted.current && !owned) {
      setOwned(true);
    }
  }, [car.keyCar, selectedStarRank, owned]);

  const handleStarSelect = (value: number) => {
    hasUserInteracted.current = true;
    userChanged.current = true;
    setSelectedStarRank(value);
  };

  useEffect(() => {
    if (forceOwned && !owned) setOwned(true);
  }, [forceOwned, owned]);

  useEffect(() => {
    setCarTrackingData(carKey, { stars: selectedStarRank, owned, goldMaxed });
    if (userChanged.current) {
      userChanged.current = false;
      notifyCarTrackingChanged(carKey, 'basicInfo');
    }
  }, [carKey, selectedStarRank, owned, goldMaxed]);

  useAutoSyncDependency([selectedStarRank, owned, goldMaxed]);

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
          <td style={{ textAlign: 'center' }}>
            <label>
              <input
                type="checkbox"
                checked={owned}
                onChange={(e) => {
                  userChanged.current = true;
                  setOwned(e.target.checked);
                }}
              />{' '}
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
                  userChanged.current = true;
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