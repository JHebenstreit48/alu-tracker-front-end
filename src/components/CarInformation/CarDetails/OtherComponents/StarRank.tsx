import "@/SCSS/MiscellaneousStyle/StarRank.scss";
import { useEffect, useState } from "react";
import { loadCarTrackingProgress, saveCarTrackingProgress } from "@/components/CarInformation/CarDetails/Miscellaneous/StorageUtils";

interface StarRatingProps {
  count: number; // Max stars this car can have
  trackerMode?: boolean;
  carId?: string; // Needed to track progress uniquely
}

const backendBaseUrl = import.meta.env.VITE_API_BASE_URL;

const StarRank: React.FC<StarRatingProps> = ({ count, trackerMode = false, carId }) => {
  const [selectedStars, setSelectedStars] = useState<number>(0);

  useEffect(() => {
    if (trackerMode && carId) {
      const data = loadCarTrackingProgress(carId);
      if (data) {
        setSelectedStars(data.currentStars || 0);
      }
    }
  }, [carId, trackerMode]);

  const handleStarClick = (index: number) => {
    if (!trackerMode || !carId) return;
    const newStars = index + 1;
    setSelectedStars(newStars);

    const currentData = loadCarTrackingProgress(carId) || {
      carId,
      owned: false,
      currentStars: 0,
      upgradeStage: 0,
      importParts: 0,
    };

    saveCarTrackingProgress({
      ...currentData,
      currentStars: newStars,
    });
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
            className={`starIcon ${trackerMode ? "clickable" : ""} ${!isFilled && trackerMode ? "grayed" : ""}`}
            onClick={() => handleStarClick(i)}
          />
        );
      })}
    </div>
  );
};

export default StarRank;
