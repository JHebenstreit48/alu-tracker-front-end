import { useEffect, useState } from "react";
import { Car } from "@/components/CarInformation/CarDetails/Miscellaneous/CarInterfaces";
import StarRankSelector from "@/components/CarInformation/CarDetails/OtherComponents/StarRankSelector";

interface ClassRankProps {
  car: Car;
  trackerMode?: boolean;
}

const ClassRank: React.FC<ClassRankProps> = ({ car, trackerMode = false }) => {
  const [selectedStarRank, setSelectedStarRank] = useState<number>(car.Stars);
  const [owned, setOwned] = useState<boolean>(false);

  // Load saved tracking state
  useEffect(() => {
    const saved = localStorage.getItem(`car-${car._id}-tracking`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setSelectedStarRank(parsed.starRank ?? car.Stars);
        setOwned(parsed.owned ?? false);
      } catch {
        console.warn("Corrupt tracking data for", car._id);
      }
    }
  }, [car._id, car.Stars]);

  // Persist tracking state
  useEffect(() => {
    localStorage.setItem(
      `car-${car._id}-tracking`,
      JSON.stringify({ starRank: selectedStarRank, owned })
    );
  }, [selectedStarRank, owned, car._id]);

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
            <td style={{ textAlign: "center" }}>
              <StarRankSelector
                maxStars={car.Stars}
                selected={trackerMode ? selectedStarRank : car.Stars}
                onSelect={trackerMode ? setSelectedStarRank : undefined}
              />
            </td>
          </tr>
          <tr>
            <td className="maxRank">Max Rank: {car.Max_Rank}</td>
          </tr>
          {trackerMode && (
            <tr>
              <td style={{ textAlign: "center" }}>
                <label>
                  <input
                    type="checkbox"
                    checked={owned}
                    onChange={() => setOwned((prev) => !prev)}
                  />{" "}
                  I own this car
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
