import { useEffect, useState } from 'react';
import PageTab from '@/components/Shared/Navigation/PageTab';
import Header from '@/components/Shared/HeaderFooter/Header';
import {
  getAllCarTrackingData,
  CarTrackingData,
  generateCarKey,
} from '@/utils/shared/StorageUtils';
import { Car } from '@/interfaces/CarDetails';

import SyncButton from '@/components/UserDataSync/components/SyncButton';

import CarsOwned from '@/components/Tracking/Cars/ProgressCircles/OwnedProgressCircles/Labels/CarsOwned';
import OwnedProgress from '@/components/Tracking/Cars/ProgressCircles/OwnedProgressCircles/UI/OwnedProgress';
import GoldMaxed from '@/components/Tracking/Cars/ProgressCircles/OwnedProgressCircles/Labels/GoldMaxed';
import GoldMaxedProgress from '@/components/Tracking/Cars/ProgressCircles/OwnedProgressCircles/UI/GoldMaxedProgress';
import TotalKeys from '@/components/Tracking/Cars/ProgressCircles/OwnedProgressCircles/Labels/TotalKeys';
import OwnedKeyProgress from '@/components/Tracking/Cars/ProgressCircles/OwnedProgressCircles/UI/OwnedKeyProgress';
import StarRankCircles from '@/components/Tracking/Cars/ProgressCircles/CarTotalStars/Layout/StarRankCircles';
import MaxStarRank from '@/components/Tracking/Cars/MaxStarRank/Layout/MaxStarRank';

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

  // helper to recompute page state from localStorage + current cars list
  const recomputeFromLocal = (carsList = allCars) => {
    const allTracked = getAllCarTrackingData();
    setTrackedCars(
      Object.entries(allTracked).map(([carId, data]) => ({
        carId,
        ...data,
      }))
    );

    const keyCars = carsList.filter((car) => car.KeyCar);
    const keyCarKeys = keyCars.map((car) => generateCarKey(car.Brand, car.Model));

    const keysObtained = Object.entries(allTracked)
      .filter(([, val]) => val.keyObtained)
      .map(([key]) => key)
      .filter((k) => keyCarKeys.includes(k));

    const ownedKeyCars = Object.entries(allTracked)
      .filter(([, val]) => val.owned)
      .map(([key]) => key)
      .filter((k) => keyCarKeys.includes(k));

    setKeyCarSummary({
      total: keyCarKeys.length,
      obtained: keysObtained.length,
      owned: ownedKeyCars.length,
    });
  };

  // initial load + listen for Push/Pull completion
  useEffect(() => {
    recomputeFromLocal();
    const onSynced = () => recomputeFromLocal();
    window.addEventListener('user-progress-synced', onSynced);
    return () => window.removeEventListener('user-progress-synced', onSynced);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // fetch cars (cache-busted) and prefer live array length for total
  useEffect(() => {
    const url = `${
      import.meta.env.VITE_CARS_API_BASE_URL ?? 'https://alutracker-api.onrender.com'
    }/api/cars?limit=2000&offset=0&t=${Date.now()}`;

    fetch(url, { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => {
        const cars = (Array.isArray(data?.cars) ? data.cars : []) as Car[];
        setAllCars(cars);
        setTotalCars(Math.max(cars.length, Number(data?.total ?? 0)));
        recomputeFromLocal(cars);
      })
      .catch((err) => {
        console.error('Failed to fetch total car count or key car info:', err);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
          {/* ===== Section: Car Collection Progress ===== */}
          <hr className="sectionRule" />
          <h2 className="carCollectionTitle">Car Collection Progress</h2>
          <hr className="sectionRule" />

          <div className="summaryProgressRow">
            <div className="progressGroup">
              <OwnedProgress
                ownedCount={ownedCars.length}
                totalCars={totalCars}
              />
              <CarsOwned
                ownedCount={ownedCars.length}
                totalCars={totalCars}
              />
            </div>

            <div className="progressGroup">
              <GoldMaxedProgress
                goldMaxedCount={goldMaxedCars.length}
                totalCars={totalCars}
              />
              <GoldMaxed
                goldMaxedCount={goldMaxedCars.length}
                totalCars={totalCars}
              />
            </div>

            <div className="progressGroup">
              <OwnedKeyProgress
                obtained={keyCarSummary.obtained}
                total={keyCarSummary.total}
              />
              <TotalKeys
                obtained={keyCarSummary.obtained}
                owned={keyCarSummary.owned}
                total={keyCarSummary.total}
              />
            </div>
          </div>

          <hr className="sectionRule" />
          {/* ===== Section: Star Rank Progress ===== */}
          <h2 className="starProgressTitle">Star Rank Progress</h2>
          <hr className="sectionRule" />

          <div className="circleAndTableRow">
            <div className="circleColumn">
              <StarRankCircles
                starCounts={starCounts}
                totalOwned={ownedCars.length}
              />
            </div>

            <div className="tableColumn">
              <MaxStarRank
                allCars={allCars}
                trackedCars={enrichedTrackedCars}
                totalCars={totalCars}
              />
            </div>
          </div>

          {/* ===== Section: Garage Level Progress (placeholder) ===== */}
          <hr className="sectionRule" />
          <h2 className="garageLevelsTitle">Garage Level Progress</h2>
          <hr className="sectionRule" />
          <p className="comingSoonText">Coming Soon...</p>
          {/* future content... */}
        </div>
      </PageTab>
    </div>
  );
}