import { useEffect, useState } from 'react';
import PageTab from '@/components/Shared/PageTab';
import Header from '@/components/Shared/Header';
import {
  getAllCarTrackingData,
  CarTrackingData,
  generateCarKey,
} from '@/components/CarInformation/CarDetails/Miscellaneous/StorageUtils';
import { Car } from '@/components/CarInformation/CarDetails/Miscellaneous/Interfaces';

import SyncButton from '@/components/CarInformation/UserDataSync/SyncButton';

import CarsOwned from '@/components/CarInformation/CarTracker/ProgressCircles/OwnedProgressCircles/Labels/CarsOwned';
import OwnedProgress from '@/components/CarInformation/CarTracker/ProgressCircles/OwnedProgressCircles/UI/OwnedProgress';
import GoldMaxed from '@/components/CarInformation/CarTracker/ProgressCircles/OwnedProgressCircles/Labels/GoldMaxed';
import GoldMaxedProgress from '@/components/CarInformation/CarTracker/ProgressCircles/OwnedProgressCircles/UI/GoldMaxedProgress';
import TotalKeys from '@/components/CarInformation/CarTracker/ProgressCircles/OwnedProgressCircles/Labels/TotalKeys';
import OwnedKeyProgress from '@/components/CarInformation/CarTracker/ProgressCircles/OwnedProgressCircles/UI/OwnedKeyProgress';
import StarRankCircles from '@/components/CarInformation/CarTracker/ProgressCircles/CarTotalStars/Layout/StarRankCircles';
import MaxStarRank from '@/components/CarInformation/CarTracker/MaxStarRank/Layout/MaxStarRank';

import '@/scss/Cars/CarTracker/Layout/CarTracker.scss';
import '@/scss/Cars/CarTracker/Components/CarsOwned.scss';
import '@/scss/Cars/CarTracker/Components/KeysOwned.scss';
import '@/scss/Cars/CarTracker/Components/GoldMaxed.scss';
import '@/scss/Cars/CarTracker/Components/StarRank.scss';

interface TrackedCar extends CarTrackingData {
  carId: string;
}

interface KeyCarSummary {
  total: number;
  obtained: number;
  owned: number;
}

export default function CarTracker() {
  const [trackedCars, setTrackedCars] = useState<TrackedCar[]>([]);
  const [totalCars, setTotalCars] = useState<number>(0);
  const [allCars, setAllCars] = useState<Car[]>([]);
  const [keyCarSummary, setKeyCarSummary] = useState<KeyCarSummary>({
    total: 0,
    obtained: 0,
    owned: 0,
  });

  useEffect(() => {
    const allTracked = getAllCarTrackingData();
    setTrackedCars(
      Object.entries(allTracked).map(([carId, data]) => ({
        carId,
        ...data,
      }))
    );

    fetch(
      `${
        import.meta.env.VITE_API_BASE_URL ?? 'https://alutracker-api.onrender.com'
      }/api/cars?limit=1000&offset=0`
    )
      .then((res) => res.json())
      .then((data) => {
        if (typeof data.total === 'number') {
          setTotalCars(data.total);
        }

        const cars = data.cars as Car[];
        setAllCars(cars);

        const keyCars = cars.filter((car) => car.KeyCar);
        const keyCarKeys = keyCars.map((car) => generateCarKey(car.Brand, car.Model));

        const keysObtained = Object.entries(allTracked)
          .filter(([, val]) => val.keyObtained)
          .map(([key]) => key);

        const ownedKeyCars = Object.entries(allTracked)
          .filter(([, val]) => val.owned)
          .map(([key]) => key);

        setKeyCarSummary({
          total: keyCarKeys.length,
          obtained: keysObtained.length,
          owned: ownedKeyCars.length,
        });

        console.log('🧪 Key car summary:', {
          totalFromBackend: keyCarKeys.length,
          keysObtainedFromLocal: keysObtained.length,
          carsOwnedInLocal: ownedKeyCars.length,
        });
      })
      .catch((err) => {
        console.error('Failed to fetch total car count or key car info:', err);
      });
  }, []);

  const ownedCars = trackedCars.filter((car) => car.owned);
  const goldMaxedCars = trackedCars.filter((car) => car.goldMaxed);

  type StarRank = 1 | 2 | 3 | 4 | 5 | 6;

  const starCounts: Record<StarRank, number> = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0,
  };

  ownedCars.forEach((car) => {
    const stars = car.stars ?? 0;
    if (stars >= 1 && stars <= 6) {
      starCounts[stars as StarRank]++;
    }
  });

  const enrichedTrackedCars: (Car & CarTrackingData)[] = allCars
    .map((car) => {
      const key = generateCarKey(car.Brand, car.Model);
      const trackingData = getAllCarTrackingData()[key];
      return trackingData ? { ...car, ...trackingData } : null;
    })
    .filter((c): c is Car & CarTrackingData => c !== null);

  return (
    <div className="carTrackerPage">
      <PageTab title="Car Tracker">
        <Header text="Car Tracker Summary" />

        <button
          className="carTrackerBackBtn"
          onClick={() => window.history.back()}
        >
          Back to Cars
        </button>

        <SyncButton />

        <div className="trackerSummaryBlock">
          <div className="summaryProgressRow">
            <OwnedProgress ownedCount={ownedCars.length} totalCars={totalCars} />
            <CarsOwned ownedCount={ownedCars.length} totalCars={totalCars} />

            <GoldMaxedProgress goldMaxedCount={goldMaxedCars.length} totalCars={totalCars} />
            <GoldMaxed goldMaxedCount={goldMaxedCars.length} totalCars={totalCars} />

            <OwnedKeyProgress obtained={keyCarSummary.obtained} total={keyCarSummary.total} />
            <TotalKeys
              obtained={keyCarSummary.obtained}
              owned={keyCarSummary.owned}
              total={keyCarSummary.total}
            />
          </div>

          <div className="circleAndTableRow">
            <StarRankCircles starCounts={starCounts} totalOwned={ownedCars.length} />

            <MaxStarRank
              allCars={allCars}
              trackedCars={enrichedTrackedCars}
              totalCars={totalCars}
            />
          </div>
        </div>
      </PageTab>
    </div>
  );
}