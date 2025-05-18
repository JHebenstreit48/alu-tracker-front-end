import { useEffect, useState } from "react";
import PageTab from "@/components/Shared/PageTab";
import Header from "@/components/Shared/Header";
import {
  getAllCarTrackingData,
  CarTrackingData,
  generateCarKey,
} from "@/components/CarInformation/CarDetails/Miscellaneous/StorageUtils";
import { Car } from "@/components/CarInformation/CarDetails/Miscellaneous/CarInterfaces";

import CarsOwned from "@/components/CarInformation/CarTracker/CarsOwned";
import OwnedProgress from "@/components/CarInformation/CarTracker/OwnedProgress";
import GoldMaxed from "@/components/CarInformation/CarTracker/GoldMaxed";
import GoldMaxedProgress from "@/components/CarInformation/CarTracker/GoldMaxedProgress";
import TotalKeys from "@/components/CarInformation/CarTracker/TotalKeys";
import OwnedKeyProgress from "@/components/CarInformation/CarTracker/OwnedKeyProgress";
import SyncButton from "@/components/CarInformation/UserDataSync/SyncButton";

import "@/SCSS/Cars/CarTracker/CarTracker.scss";
import "@/SCSS/Cars/CarTracker/CarsOwned.scss";
import "@/SCSS/Cars/CarTracker/KeysOwned.scss";
import "@/SCSS/Cars/CarTracker/GoldMaxed.scss";

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

        const keyCarKeys = keyCars.map((car) =>
          generateCarKey(car.Brand, car.Model)
        );

        const keysObtained = keyCarKeys.filter(
          (key) => allTracked[key]?.keyObtained
        );
        const ownedKeyCars = keyCarKeys.filter(
          (key) => allTracked[key]?.owned
        );

        setKeyCarSummary({
          total: keyCarKeys.length,
          obtained: keysObtained.length,
          owned: ownedKeyCars.length,
        });

        console.log("🧪 Key car summary:", {
          totalFromBackend: keyCarKeys.length,
          keysObtainedFromLocal: keysObtained.length,
          keyCarsOwnedInLocal: ownedKeyCars.length,
        });

        console.log("🧪 Full key car keys from backend:", keyCarKeys);
        console.log("🧪 Keys obtained (from localStorage):", keysObtained);
        console.log(
          "🧪 Key cars marked owned (from localStorage):",
          ownedKeyCars
        );

        const allTrackedIdsMarkedKey = Object.entries(allTracked)
          .filter(([, val]) => val.keyObtained || val.owned)
          .map(([id]) => id);

        console.log(
          "🧪 All cars marked keyObtained or owned in localStorage:",
          allTrackedIdsMarkedKey
        );
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

        <SyncButton />

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
