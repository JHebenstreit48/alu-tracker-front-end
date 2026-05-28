import React, { useEffect, useRef, useState } from 'react';
import { Car, ObtainableViaEntry } from '@/types/shared/car';
import StarRankSelector from '@/components/CarDetails/OtherComponents/StarRankSelector';
import { useAutoSyncDependency } from '@/hooks/UserDataSync/useAutoSync';
import {
  generateCarKey,
  getCarTrackingData,
  setCarTrackingData,
} from '@/utils/shared/StorageUtils';
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
          const rendered: React.ReactNode[] = [];
          let shortBuffer: string[] = [];

          const flushBuffer = (key: string) => {
            if (shortBuffer.length > 0) {
              rendered.push(
                <span key={key} className="obtainable-method-item">
                  {shortBuffer.join(' | ')}
                </span>
              );
              shortBuffer = [];
            }
          };

          group.methods.forEach((method, j) => {
            if (method.length <= SHORT_METHOD_THRESHOLD) {
              shortBuffer.push(method);
            } else {
              flushBuffer(`buf-${j}`);
              rendered.push(
                <span key={j} className="obtainable-method-item">
                  {method}
                </span>
              );
            }
          });
          flushBuffer('buf-end');

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
              <div className="obtainable-methods">
                {rendered}
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

  useEffect(() => {
    if (!car.keyCar && selectedStarRank > 0 && hasUserInteracted.current && !owned) {
      setOwned(true);
    }
  }, [car.keyCar, selectedStarRank, owned]);

  const handleStarSelect = (value: number) => {
    hasUserInteracted.current = true;
    setSelectedStarRank(value);
  };

  useEffect(() => {
    if (forceOwned && !owned) setOwned(true);
  }, [forceOwned, owned]);

  useEffect(() => {
    setCarTrackingData(carKey, { stars: selectedStarRank, owned, goldMaxed });
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
          <td>Obtainable Via</td>
          <td
            id="obtainable-cell"
            className="obtainable-cell"
            style={{ padding: 0, verticalAlign: 'top' }}
          >
            {renderObtainableVia(car.obtainableVia)}
          </td>
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