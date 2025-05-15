import { useEffect, useState } from "react";
import { Car } from "@/components/CarInformation/CarDetails/Miscellaneous/CarInterfaces";
import StarRankSelector from "@/components/CarInformation/CarDetails/OtherComponents/StarRankSelector";
import {
  getCarTrackingData,
  setCarTrackingData,
} from "@/components/CarInformation/CarDetails/Miscellaneous/StorageUtils";

interface ClassRankProps {
  car: Car;
  trackerMode?: boolean;
  forceOwned?: boolean;
}

const ClassRank: React.FC<ClassRankProps> = ({ car, trackerMode = false, forceOwned }) => {
  const [selectedStarRank, setSelectedStarRank] = useState<number>(car.Stars);
  const [owned, setOwned] = useState<boolean>(false);
  const [goldMax, setGoldMax] = useState<boolean>(false);

  // Load tracking state from localStorage
  useEffect(() => {
    if (trackerMode && car._id) {
      const data = getCarTrackingData(car._id);

      if (typeof data.stars === "number") {
        setSelectedStarRank(data.stars);
      } else {
        setSelectedStarRank(0);
      }

      if (typeof data.owned === "boolean") {
        setOwned(data.owned);
      }

      if (typeof data.goldMax === "boolean") {
        setGoldMax(data.goldMax);
      }
    } else if (trackerMode) {
      setSelectedStarRank(0);
      setOwned(false);
      setGoldMax(false);
    }
  }, [car._id, trackerMode]);

  // Auto-check owned when forceOwned is triggered or stars selected (non-KeyCar)
  useEffect(() => {
    if (trackerMode) {
      if (forceOwned && !owned) {
        setOwned(true);
      } else if (!car.KeyCar && selectedStarRank > 0 && !owned) {
        setOwned(true);
      }
    }
  }, [trackerMode, forceOwned, selectedStarRank, car.KeyCar, owned]);

  // Save to localStorage
  useEffect(() => {
    if (trackerMode && car._id) {
      setCarTrackingData(car._id, {
        stars: selectedStarRank,
        owned,
        goldMax,
      });
    }
  }, [car._id, trackerMode, selectedStarRank, owned, goldMax]);

  return (
    <div className="carDetailTables">
      <table className="carInfoTable">
        <thead>
          <tr>
            <th className="tableHeader2" colSpan={2}>
              Class {car.Class}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan={2} style={{ textAlign: "center" }}>
              <StarRankSelector
                maxStars={car.Stars}
                selected={trackerMode ? selectedStarRank : car.Stars}
                onSelect={trackerMode ? setSelectedStarRank : undefined}
              />
            </td>
          </tr>
          <tr>
            <td className="maxRank" colSpan={2}>
              Max Rank: {car.Max_Rank}
            </td>
          </tr>

          {trackerMode && (
            <tr>
              <td style={{ textAlign: "center" }}>
                <label>
                  <input
                    type="checkbox"
                    checked={owned}
                    onChange={(e) => setOwned(e.target.checked)}
                  />{" "}
                  Owned
                </label>
              </td>
              <td style={{ textAlign: "center" }}>
                <label>
                  <input
                    type="checkbox"
                    checked={goldMax}
                    onChange={(e) => setGoldMax(e.target.checked)}
                  />{" "}
                  Gold Maxed
                </label>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ClassRank;
