import { useEffect, useState } from "react";
import { Car } from "@components/CarInformation/CarDetails/Miscellaneous/CarInterfaces";
import {
  saveCarTrackingProgress,
  loadCarTrackingProgress,
} from "@/components/CarInformation/CarDetails/Miscellaneous/StorageUtils";

interface Props {
  car: Car;
}

export default function ProgressTracker({ car }: Props) {
  const [owned, setOwned] = useState(false);
  const [currentStars, setCurrentStars] = useState(1);
  const [upgradeStage, setUpgradeStage] = useState(0);
  const [importParts, setImportParts] = useState(0);

  useEffect(() => {
    const existing = loadCarTrackingProgress(car._id || "");
    if (existing) {
      setOwned(existing.owned);
      setCurrentStars(existing.currentStars);
      setUpgradeStage(existing.upgradeStage);
      setImportParts(existing.importParts);
    }
  }, [car._id]);

  const handleSave = () => {
    saveCarTrackingProgress({
      carId: car._id || "",
      owned,
      currentStars,
      upgradeStage,
      importParts,
    });
    alert("Progress saved!");
  };

  return (
    <div className="tracker-container">
      <label>
        <input
          type="checkbox"
          checked={owned}
          onChange={(e) => setOwned(e.target.checked)}
        />
        Owned
      </label>

      <label>
        Star Rank:
        <select
          value={currentStars}
          onChange={(e) => setCurrentStars(parseInt(e.target.value))}
        >
          {[1, 2, 3, 4, 5, 6].map((val) => (
            <option key={val} value={val}>
              {val} Stars
            </option>
          ))}
        </select>
      </label>

      <label>
        Upgrade Stage:
        <input
          type="number"
          value={upgradeStage}
          onChange={(e) => setUpgradeStage(parseInt(e.target.value))}
          min={0}
          max={12}
        />
      </label>

      <label>
        Import Parts:
        <input
          type="number"
          value={importParts}
          onChange={(e) => setImportParts(parseInt(e.target.value))}
          min={0}
          max={6}
        />
      </label>

      <button onClick={handleSave}>Save Progress</button>
    </div>
  );
}
