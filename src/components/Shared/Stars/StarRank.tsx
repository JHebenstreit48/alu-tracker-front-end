import "@/scss/MiscellaneousStyle/StarRank.scss";
import { useEffect, useState } from "react";
import {
  getCarTrackingData,
  setCarTrackingData,
} from "@/utils/CarDetails/StorageUtils";
import { useAutoSyncDependency } from "@/components/UserDataSync/hooks/useAutoSync";

interface StarRatingProps {
  count: number; // Max stars this car can have
  trackerMode?: boolean;
  trackingKey?: string;
  isKeyCar?: boolean; // Optional for key cars
}

const backendBaseUrl = import.meta.env.VITE_CARS_API_BASE_URL;

const StarRank: React.FC<StarRatingProps> = ({
  count,
  trackerMode = false,
  trackingKey,
  isKeyCar
}) => {
  const [selectedStars, setSelectedStars] = useState<number>(0);

  // ✅ Sync stars to account automatically when changed
  useAutoSyncDependency([selectedStars]);

  useEffect(() => {
    if (trackerMode && trackingKey) {
      const data = getCarTrackingData(trackingKey);
  
      if (typeof data.stars === "number" && data.stars > 0) {
        setSelectedStars(data.stars); // ✅ Use user's saved stars
      } else if (isKeyCar) {
        setSelectedStars(1); // ✅ Default to 1 star for key cars if no saved data
      } else {
        setSelectedStars(0); // Non-key cars default to 0
      }
    }
  }, [trackingKey, trackerMode, isKeyCar]);
  

  const handleStarClick = (index: number) => {
    if (!trackerMode || !trackingKey) return;

    const newStars = index + 1;
    setSelectedStars(newStars);
    setCarTrackingData(trackingKey, { stars: newStars });
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
