import "@/scss/MiscellaneousStyle/StarRank.scss";
import { useEffect, useState } from "react";
import {
  getCarTrackingData,
  setCarTrackingData,
} from "@/components/CarInformation/CarDetails/Miscellaneous/StorageUtils";
import { useAutoSyncDependency } from "@/components/CarInformation/UserDataSync/hooks/useAutoSync";

interface StarRatingProps {
  count: number; // Max stars this car can have
  trackerMode?: boolean;
  carId?: string;
}

const backendBaseUrl = import.meta.env.VITE_API_BASE_URL;

const StarRank: React.FC<StarRatingProps> = ({
  count,
  trackerMode = false,
  carId,
}) => {
  const [selectedStars, setSelectedStars] = useState<number>(0);

  // ✅ Sync stars to account automatically when changed
  useAutoSyncDependency([selectedStars]);

  useEffect(() => {
    if (trackerMode && carId) {
      const data = getCarTrackingData(carId);
      if (typeof data.stars === "number") {
        setSelectedStars(data.stars);
      }
    }
  }, [carId, trackerMode]);

  const handleStarClick = (index: number) => {
    if (!trackerMode || !carId) return;

    const newStars = index + 1;
    setSelectedStars(newStars);
    setCarTrackingData(carId, { stars: newStars });
  };

  const safeCount = Number.isInteger(count) && count > 0 ? count : 0;

  return (
    <div className="StarRating">
      {Array.from({ length: safeCount }).map((_, i) => {
        const isFilled = i < selectedStars;
        return (
          <img
            key={i}
            src={`${backendBaseUrl}/images/icons/star.png`}
            alt="Star"
            className={`starIcon ${trackerMode ? "clickable" : ""} ${
              !isFilled && trackerMode ? "grayed" : ""
            }`}
            onClick={() => handleStarClick(i)}
          />
        );
      })}
    </div>
  );
};

export default StarRank;
