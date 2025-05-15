import PageTab from "@/components/Shared/PageTab";
import Header from "@/components/Shared/Header";
import { useEffect, useState } from "react";
import { getTrackedCars } from "@/components/CarInformation/CarDetails/StorageUtils";

interface CarTrackerEntry {
  carId: string;
  owned: boolean;
  currentStars: number;
  upgradeStage: number;
  importParts: number;
}

export default function CarTrackerPage() {
  const [trackedCars, setTrackedCars] = useState<CarTrackerEntry[]>([]);

  useEffect(() => {
    const data = getTrackedCars();
    setTrackedCars(data);
  }, []);

  const ownedCars = trackedCars.filter((car) => car.owned);
  const totalOwned = ownedCars.length;
  const totalTracked = trackedCars.length;

  return (
    <div>
      <PageTab title="Car Tracker">
        <Header text="Car Tracker Summary" />
        <p>
          You currently own {totalOwned} of {totalTracked} cars.
        </p>

        {/* Future enhancements: upgrade progress, stars, etc. */}
      </PageTab>
    </div>
  );
}
