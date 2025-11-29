import { useState } from 'react';
import Header from '@/components/Shared/HeaderFooter/Header';
import PageTab from '@/components/Shared/Navigation/PageTab';
import GarageLevelsDropDown from '@/components/GarageLevels/Dropdown';
import TrackerToggle from '@/components/Tracking/shared/TrackerToggle';
import GarageLevelTracker from '@/components/GarageLevels/Tracker';
import BackToTop from '@/components/Shared/Navigation/BackToTopButton';
import { useGarageLevels } from '@/hooks/GarageLevels/useGarageLevels';

import '@/scss/GarageLevels/GarageLevels.scss';

export default function GarageLevels() {
  const { levels, loading, error } = useGarageLevels();
  const [isTrackerMode, setIsTrackerMode] = useState(
    () => localStorage.getItem('garageLevelTrackerMode') === 'true'
  );

  const handleToggle = (value: boolean) => {
    setIsTrackerMode(value);
    localStorage.setItem('garageLevelTrackerMode', String(value));
  };

  return (
    <div className="garageLevelsPage">
      <PageTab title="Garage Levels">
        <Header
          text="Garage Levels"
          className="garageLevelsHeader"
        />

        <div className="glTrackerToggle">
          <TrackerToggle
            isEnabled={isTrackerMode}
            onToggle={handleToggle}
          />
        </div>

        {loading && <p>Loading garage levels…</p>}
        {error && <p className="error">{error}</p>}

        {!loading && !error && (
          <>
            {isTrackerMode && <GarageLevelTracker levels={levels} />}
            <GarageLevelsDropDown levels={levels} />
          </>
        )}

        <BackToTop />
      </PageTab>
    </div>
  );
}