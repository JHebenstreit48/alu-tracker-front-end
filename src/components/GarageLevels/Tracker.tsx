import React, { useContext, useEffect, useRef, useState } from 'react';
import type { GarageLevelsInterface } from '@/types/GarageLevels/garageLevelCars';
import { AuthContext } from '@/context/Auth/authContext';
import { useUserGarageLevelSync } from '@/hooks/GarageLevels/useUserGarageLevelSync';
import '@/scss/GarageLevels/Tracker.scss';

interface GarageLevelTrackerProps {
  levels: GarageLevelsInterface[];
}

const GarageLevelTracker: React.FC<GarageLevelTrackerProps> = ({ levels }) => {
  const { token } = useContext(AuthContext);
  const {
    currentGarageLevel,
    currentGLXp,
    garageLevelTrackerMode,
    loading: glLoading,
    save,
  } = useUserGarageLevelSync(token);

  const [currentLevel, setCurrentLevel] = useState(1);
  const [currentXp, setCurrentXp] = useState('');
  const hydrated = useRef(false);

  // Once Firebase → localStorage → default resolution finishes,
  // hydrate the editable inputs with the freshest known value.
  useEffect(() => {
    if (!glLoading && !hydrated.current) {
      setCurrentLevel(currentGarageLevel || 1);
      setCurrentXp(currentGLXp ? currentGLXp.toLocaleString('en-US') : '');
      hydrated.current = true;
    }
  }, [glLoading, currentGarageLevel, currentGLXp]);

  const nextLevelData = levels.find((level) => level.GarageLevelKey === currentLevel + 1);
  const nextXpRequired = nextLevelData?.xp || 0;

  const xpRemaining =
    nextXpRequired > 0 ? Math.max(nextXpRequired - Number(currentXp.replace(/,/g, '')), 0) : 0;

  // Debounced save on every change — skip the very first run (hydration).
  useEffect(() => {
    if (!hydrated.current) return;

    save({
      currentGarageLevel: currentLevel,
      currentGLXp: Number(currentXp.replace(/,/g, '')) || 0,
      garageLevelTrackerMode: garageLevelTrackerMode || 'default',
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentLevel, currentXp]);

  const handleXpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/,/g, '');
    if (/^\d*$/.test(value)) {
      const formattedValue = value === '' ? '' : Number(value).toLocaleString('en-US');
      setCurrentXp(formattedValue);
    }
  };

  return (
    <div className="garageLevelTracker">
      <div className="levelSelector">
        <label>
          Select Current Garage Level:
          <select
            className="garageLevelSelect"
            value={currentLevel}
            onChange={(e) => setCurrentLevel(Number(e.target.value))}
          >
            {levels.map((level) => (
              <option
                key={level.GarageLevelKey}
                value={level.GarageLevelKey}
              >
                Garage Level {level.GarageLevelKey}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="xpInputSection">
        <label>
          Enter Current XP:
          <input
            className="garageLevelXpInput"
            type="text"
            value={currentXp}
            onChange={handleXpChange}
            placeholder="0"
          />
        </label>
      </div>

      <div className="xpRemaining">
        <label>
          XP to Next Level:{' '}
          <strong>{xpRemaining > 0 ? xpRemaining.toLocaleString('en-US') : '0'}</strong>
        </label>
      </div>
    </div>
  );
};

export default GarageLevelTracker;