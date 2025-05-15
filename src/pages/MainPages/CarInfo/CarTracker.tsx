import { useEffect, useState } from "react";
import PageTab from "@/components/Shared/PageTab";
import Header from "@/components/Shared/Header";
import {
  getAllCarTrackingData,
  CarTrackingData,
} from "@/components/CarInformation/CarDetails/Miscellaneous/StorageUtils";

import CarsOwned from "@/components/CarInformation/CarTracker/CarsOwned";
import OwnedProgress from "@/components/CarInformation/CarTracker/OwnedProgress";
import GoldMaxed from "@/components/CarInformation/CarTracker/GoldMaxed";
import GoldMaxedProgress from "@/components/CarInformation/CarTracker/GoldMaxedProgress";
import "@/SCSS/Cars/CarTracker/CarTracker.scss";

interface TrackedCar extends CarTrackingData {
  carId: string;
}

export default function CarTrackerPage() {
  const [trackedCars, setTrackedCars] = useState<TrackedCar[]>([]);
  const [totalCars, setTotalCars] = useState<number>(0);

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
      }/api/cars?limit=1&offset=0`
    )
      .then((res) => res.json())
      .then((data) => {
        if (typeof data.total === "number") {
          setTotalCars(data.total);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch total car count:", err);
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
        </div>
      </PageTab>
    </div>
  );
}
