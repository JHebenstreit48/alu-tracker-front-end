import { useState } from 'react';
import Header from '@/components/Shared/HeaderFooter/Header';
import PageTab from '@/components/Shared/Navigation/PageTab';
import GarageLevelsDropDown from '@/components/GarageLevels/Dropdown';
import GLTrackerToggle from '@/components/GarageLevels/GLTrackerToggle';
import GarageLevelTracker from '@/components/GarageLevels/Tracker';
import BackToTop from '@/components/Shared/Navigation/BackToTopButton';
import { useGarageLevels } from '@/hooks/GarageLevels/useGarageLevels';

import '@/scss/GarageLevels/GarageLevelTracker.scss';
import '@/scss/GarageLevels/GarageLevels.scss';

export default function GarageLevelsPage() {
  const { levels, loading, error } = useGarageLevels();
  const [isTrackerMode, setIsTrackerMode] = useState(
    () => localStorage.getItem('garageLevelTrackerMode') === 'true'
  );

  return (
    <div>
      <PageTab title="Garage Levels">
        <Header
          text="Garage Levels"
          className="garageLevelsHeader"
        />
        <GLTrackerToggle onToggle={setIsTrackerMode} />

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