import { useEffect, useState } from "react";
import PageTab from "@/components/Shared/PageTab";
import Header from "@/components/Shared/Header";
import {
  getAllCarTrackingData,
  CarTrackingData,
} from "@/components/CarInformation/CarDetails/Miscellaneous/StorageUtils";
import { Car } from "@/components/CarInformation/CarDetails/Miscellaneous/CarInterfaces";

import CarsOwned from "@/components/CarInformation/CarTracker/CarsOwned";
import OwnedProgress from "@/components/CarInformation/CarTracker/OwnedProgress";
import GoldMaxed from "@/components/CarInformation/CarTracker/GoldMaxed";
import GoldMaxedProgress from "@/components/CarInformation/CarTracker/GoldMaxedProgress";
import TotalKeys from "@/components/CarInformation/CarTracker/TotalKeys";
import OwnedKeyProgress from "@/components/CarInformation/CarTracker/OwnedKeyProgress";
import "@/SCSS/Cars/CarTracker/CarTracker.scss";

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
  const [keyCarSummary, setKeyCarSummary] = useState<KeyCarSummary>({
    total: 0,
    obtained: 0,
    owned: 0,
  });

  useEffect(() => {
    const allTracked = getAllCarTrackingData();
    const entries: TrackedCar[] = Object.entries(allTracked).map(
      ([carId, data]) => ({
        carId,
        ...data,
      })
    );
    setTrackedCars(entries);

    fetch(
      `${
        import.meta.env.VITE_API_BASE_URL ??
        "https://alutracker-api.onrender.com"
      }/api/cars?limit=1000&offset=0`
    )
      .then((res) => res.json())
      .then((data) => {
        if (typeof data.total === "number") {
          setTotalCars(data.total);
        }

        const keyCars = (data.cars as Car[]).filter((car) => car.KeyCar);
        const keyCarIds = keyCars.map((car) => car._id).filter(Boolean) as string[];

        const keysObtained = keyCarIds.filter((id) => allTracked[id]?.keyObtained);
        const ownedKeyCars = keyCarIds.filter((id) => allTracked[id]?.owned);

        setKeyCarSummary({
          total: keyCarIds.length,
          obtained: keysObtained.length,
          owned: ownedKeyCars.length,
        });
      })
      .catch((err) => {
        console.error("Failed to fetch total car count or key car info:", err);
      });
  }, []);

  const ownedCars = trackedCars.filter((car) => car.owned);
  const goldMaxedCars = trackedCars.filter((car) => car.goldMax);

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

        <div className="trackerSummaryBlock">
          <OwnedProgress ownedCount={ownedCars.length} totalCars={totalCars} />
          <CarsOwned ownedCount={ownedCars.length} totalCars={totalCars} />

          <GoldMaxedProgress
            goldMaxedCount={goldMaxedCars.length}
            totalCars={totalCars}
          />
          <GoldMaxed
            goldMaxedCount={goldMaxedCars.length}
            totalCars={totalCars}
          />

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
      </PageTab>
    </div>
  );
}
