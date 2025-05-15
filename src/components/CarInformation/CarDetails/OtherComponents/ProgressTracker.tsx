import { useEffect, useState } from "react";
import { Car } from "@/components/CarInformation/CarDetails/Miscellaneous/CarInterfaces";
import {
  getCarTrackingData,
  setCarTrackingData,
} from "@/components/CarInformation/CarDetails/Miscellaneous/StorageUtils";

interface Props {
  car: Car;
}

export default function ProgressTracker({ car }: Props) {
  const [owned, setOwned] = useState(false);
  const [stars, setStars] = useState(1);
  const [upgradeStage, setUpgradeStage] = useState(0);
  const [importParts, setImportParts] = useState(0);

  useEffect(() => {
    const data = getCarTrackingData(car._id || "");
    if (data) {
      setOwned(!!data.owned);
      setStars(data.stars ?? 1);
      setUpgradeStage(data.upgradeStage ?? 0);
      setImportParts(data.importParts ?? 0);
    }
  }, [car._id]);

  const handleSave = () => {
    setCarTrackingData(car._id || "", {
      owned,
      stars,
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
