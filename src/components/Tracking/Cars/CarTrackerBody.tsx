import Header from '@/components/Shared/HeaderFooter/Header';
import SyncButton from '@/components/UserDataSync/components/SyncButton';
import { useCarTrackerData } from '@/hooks/Tracking/useCarTrackerData';

import CollectionProgress from '@/components/Tracking/Cars/Sections/CollectionProgress';
import StarProgress from '@/components/Tracking/Cars/Sections/StarProgress';
import GarageLevels from '@/components/Tracking/Cars/Sections/GarageLevels';

import '@/scss/Cars/CarTracker/Layout/CarTracker.scss';
import '@/scss/Cars/CarTracker/Components/CarsOwned.scss';
import '@/scss/Cars/CarTracker/Components/KeysOwned.scss';
import '@/scss/Cars/CarTracker/Components/GoldMaxed.scss';
import '@/scss/Cars/CarTracker/Components/StarRank.scss';
import '@/scss/Cars/CarTracker/Components/GarageLevels.scss';

export default function CarTrackerBody() {
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
      <Header text="Car Tracker Summary" />

      <button
        className="carTrackerBackBtn"
        onClick={() => window.history.back()}
      >
        Back to Cars
      </button>

      <SyncButton />

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