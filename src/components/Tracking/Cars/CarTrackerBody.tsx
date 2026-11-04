import { useNavigate } from 'react-router-dom';
import Header from '@/components/Shared/header/Header';
// import SyncButton from '@/components/UserDataSync/SyncButton';
import { useCarTrackerData } from '@/hooks/Tracking/useCarTrackerData';

import CollectionProgress from '@/components/Tracking/Cars/Sections/CollectionProgress';
import StarProgress from '@/components/Tracking/Cars/Sections/StarProgress';
import GarageLevels from '@/components/Tracking/Cars/Sections/GarageLevels';

import '@/scss/carTracker/index.scss'

export default function CarTrackerBody() {
  const navigate = useNavigate();

  const {
    allCars,
    totalCars,
    trackedCars,
    keySummary,
    starCounts,
    enrichedTrackedCars,
  } = useCarTrackerData();

  const ownedCars = trackedCars.filter((car) => car.owned);
  const goldMaxedCars = trackedCars.filter((car) => car.goldMaxed);

  return (
    <>
      {/* These live outside trackerSummaryBlock, like in the original file */}
      <Header />

      <div className="trackerNavRow">
        <button
          className="carTrackerBackBtn"
          onClick={() => window.history.back()}
        >
          Back to Cars
        </button>

        <button
          className="carTrackerFavoritesBtn"
          onClick={() => navigate('/car-tracker/favorites')}
        >
          Favorites &amp; Views
        </button>
      </div>

      {/* <SyncButton /> */}

      <h1 className="trackerPageTitle">Account Progress</h1>

      {/* Only the content sections sit inside trackerSummaryBlock */}
      <div className="trackerSummaryBlock">
        <CollectionProgress
          ownedCount={ownedCars.length}
          goldMaxedCount={goldMaxedCars.length}
          totalCars={totalCars}
          keySummary={keySummary}
        />

        <StarProgress
          allCars={allCars}
          totalCars={totalCars}
          ownedCount={ownedCars.length}
          starCounts={starCounts}
          enrichedTrackedCars={enrichedTrackedCars}
        />

        <GarageLevels />
      </div>
    </>
  );
}