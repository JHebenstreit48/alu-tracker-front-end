import { useEffect, useState } from "react";
import { Car } from "@/components/CarInformation/CarDetails/Miscellaneous/CarInterfaces";
import StarRankSelector from "@/components/CarInformation/CarDetails/OtherComponents/StarRankSelector";
import {
  getCarTrackingData,
  setCarTrackingData,
  generateCarKey
} from "@/components/CarInformation/CarDetails/Miscellaneous/StorageUtils";

interface ClassRankProps {
  car: Car;
  trackerMode?: boolean;
  forceOwned?: boolean;
}

const ClassRank: React.FC<ClassRankProps> = ({
  car,
  trackerMode = false,
  forceOwned,
}) => {
  const [selectedStarRank, setSelectedStarRank] = useState<number>(car.Stars);
  const [owned, setOwned] = useState<boolean>(false);
  const [goldMaxed, setGoldMaxed] = useState<boolean>(false); // ✅ Renamed correctly

  const carKey = generateCarKey(car.Brand, car.Model);

  // Load tracking state from localStorage
  useEffect(() => {
    if (trackerMode) {
      const data = getCarTrackingData(carKey);

      setSelectedStarRank(typeof data.stars === "number" ? data.stars : 0);
      setOwned(!!data.owned);
      setGoldMaxed(!!data.goldMaxed);
    } else {
      setSelectedStarRank(0);
      setOwned(false);
      setGoldMaxed(false);
    }
  }, [carKey, trackerMode]);

  // Auto-check owned when forced or stars selected
  useEffect(() => {
    if (trackerMode && forceOwned === true && !owned) {
      setOwned(true);
    }
  }, [trackerMode, forceOwned, owned]);

  // Save to localStorage
  useEffect(() => {
    if (trackerMode) {
      setCarTrackingData(carKey, {
        stars: selectedStarRank,
        owned,
        goldMaxed, // ✅ ERROR FIXED: now correctly refers to `goldMaxed`
      });
    }
  }, [carKey, trackerMode, selectedStarRank, owned, goldMaxed]);

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
                    checked={goldMaxed}
                    onChange={(e) => {
                      const isChecked = e.target.checked;
                      setGoldMaxed(isChecked); // ✅ correct setter
                      if (isChecked) {
                        setSelectedStarRank(car.Stars);
                      }
                    }}
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
