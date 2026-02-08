import { useEffect, useState, useRef } from 'react';
import { Car } from '@/types/shared/car';
import StarRankSelector from '@/components/CarDetails/OtherComponents/StarRankSelector';
import {
  getCarTrackingData,
  setCarTrackingData,
  generateCarKey,
} from '@/utils/shared/StorageUtils';
import { useAutoSyncDependency } from '@/hooks/UserDataSync/useAutoSync';

interface ClassRankProps {
  car: Car;
  trackerMode?: boolean;
  forceOwned?: boolean;
}

const ClassRank: React.FC<ClassRankProps> = ({ car, trackerMode = false, forceOwned }) => {
  const carKey = generateCarKey(car.brand, car.model);
  const hasUserInteracted = useRef(false);

  const [selectedStarRank, setSelectedStarRank] = useState<number>(0);
  const [owned, setOwned] = useState<boolean>(false);
  const [goldMaxed, setGoldMaxed] = useState<boolean>(false);

  // ✅ Load localStorage values (if present)
  useEffect(() => {
    if (trackerMode) {
      const data = getCarTrackingData(carKey);
      setSelectedStarRank(typeof data.stars === 'number' ? data.stars : 0);
      setOwned(data.owned === true);
      setGoldMaxed(data.goldMaxed === true);
    } else {
      setSelectedStarRank(0);
      setOwned(false);
      setGoldMaxed(false);
    }
  }, [carKey, trackerMode]);

  // ✅ Only mark as owned if user manually selects star (for non-key cars)
  useEffect(() => {
    if (trackerMode && !car.keyCar && selectedStarRank > 0 && hasUserInteracted.current && !owned) {
      setOwned(true);
    }
  }, [trackerMode, car.keyCar, selectedStarRank, owned]);

  // ✅ Manual star selection updates
  const handleStarSelect = (value: number) => {
    hasUserInteracted.current = true;
    setSelectedStarRank(value);
  };

  // ✅ Force owned logic (e.g. key car and key obtained)
  useEffect(() => {
    if (trackerMode && forceOwned && !owned) {
      setOwned(true);
    }
  }, [trackerMode, forceOwned, owned]);

  // ✅ Save to localStorage
  useEffect(() => {
    if (trackerMode) {
      setCarTrackingData(carKey, {
        stars: selectedStarRank,
        owned,
        goldMaxed,
      });
    }
  }, [carKey, trackerMode, selectedStarRank, owned, goldMaxed]);

  // ✅ Sync if logged in
  useAutoSyncDependency(trackerMode ? [selectedStarRank, owned, goldMaxed] : []);

  // ✅ ObtainableVia display (supports string[] OR string OR empty/missing)
  const obtainableViaDisplay = Array.isArray(car.obtainableVia)
    ? car.obtainableVia.length
      ? car.obtainableVia.join(', ')
      : '—'
    : typeof car.obtainableVia === 'string' && car.obtainableVia.trim()
      ? car.obtainableVia.trim()
      : '—';

  return (
    <table className="carInfoTable">
      <thead>
        <tr>
          <th
            className="tableHeader2"
            colSpan={2}
          >
            Class {car.class}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td
            colSpan={2}
            style={{ textAlign: 'center' }}
          >
            <StarRankSelector
              maxStars={car.stars}
              selected={
                trackerMode ? (selectedStarRank > 0 ? selectedStarRank : undefined) : car.stars
              }
              onSelect={trackerMode ? handleStarSelect : undefined}
              brand={car.brand}
              model={car.model}
              trackerMode={trackerMode}
              isKeyCar={car.keyCar}
            />
          </td>
        </tr>

        <tr>
          <td colSpan={2}>{car.country}</td>
        </tr>

        <tr>
          <td>Rarity</td>
          <td>{car.rarity}</td>
        </tr>

        <tr>
          <td>Obtainable Via</td>
          <td>{obtainableViaDisplay}</td>
        </tr>

        {trackerMode && (
          <tr>
            <td style={{ textAlign: 'center' }}>
              <label>
                <input
                  type="checkbox"
                  checked={owned}
                  onChange={(e) => setOwned(e.target.checked)}
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
                    setGoldMaxed(isChecked);
                    if (isChecked) {
                      setSelectedStarRank(car.stars);
                    }
                  }}
                />{' '}
                Gold Maxed
              </label>
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default ClassRank;