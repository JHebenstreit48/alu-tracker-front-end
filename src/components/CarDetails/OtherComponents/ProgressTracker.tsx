import { useEffect, useState } from "react";
import { Car } from "@/types/shared/car";
import {
  getCarTrackingData,
  generateCarKey,
} from "@/utils/shared/StorageUtils";
import { setCarTrackingDataWithSync } from "@/utils/CarDetails/SyncStorageUtils";
import { useAutoSyncDependency } from "@/hooks/UserDataSync/useAutoSync";

interface Props {
  car: Car;
}

export default function ProgressTracker({ car }: Props) {
  const [owned, setOwned] = useState(false);
  const [stars, setStars] = useState(1);
  const [upgradeStage, setUpgradeStage] = useState(0);
  const [importParts, setImportParts] = useState(0);

  const carKey = generateCarKey(car.brand, car.model);

  useAutoSyncDependency([owned, stars, upgradeStage, importParts]);

  useEffect(() => {
    const data = getCarTrackingData(carKey);
    if (data) {
      setOwned(!!data.owned);
      setStars(data.stars ?? 1);
      setUpgradeStage(data.upgradeStage ?? 0);
      setImportParts(data.importParts ?? 0);
    }
  }, [carKey]);

  const handleSave = async () => {
    await setCarTrackingDataWithSync(carKey, {
      owned,
      stars,
      upgradeStage,
      importParts,
    });
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
          value={stars}
          onChange={(e) => setStars(parseInt(e.target.value))}
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
