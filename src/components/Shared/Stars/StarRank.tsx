import "@/scss/MiscellaneousStyle/StarRank.scss";
import { useEffect, useState } from "react";
import {
  getCarTrackingData,
  setCarTrackingData,
} from "@/utils/shared/StorageUtils";
import { useAutoSyncDependency } from "@/hooks/UserDataSync/useAutoSync";
import { getCarImageUrl } from "@/utils/shared/imageUrl";

interface StarRatingProps {
  count: number;          // Max stars this car can have
  trackerMode?: boolean;
  trackingKey?: string;
  isKeyCar?: boolean;     // Optional for key cars
}

// Star icon stored/seeded as images/icons/star.png in Firebase Storage.
// We resolve via the shared helper so it works locally & in prod.
const STAR_ICON_SRC =
  getCarImageUrl("/images/icons/star.png") || "/images/icons/star.png";

const StarRank: React.FC<StarRatingProps> = ({
  count,
  trackerMode = false,
  trackingKey,
  isKeyCar,
}) => {
  const [selectedStars, setSelectedStars] = useState<number>(0);

  // Sync stars to account automatically when changed
  useAutoSyncDependency([selectedStars]);

  useEffect(() => {
    if (trackerMode && trackingKey) {
      const data = getCarTrackingData(trackingKey);

      if (typeof data.stars === "number" && data.stars > 0) {
        // Use user's saved stars
        setSelectedStars(data.stars);
      } else if (isKeyCar) {
        // Default to 1 star for key cars if no saved data
        setSelectedStars(1);
      } else {
        setSelectedStars(0);
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
            src={STAR_ICON_SRC}
            alt="Star"
            className={[
              "starIcon",
              trackerMode ? "clickable" : "",
              !isFilled && trackerMode ? "grayed" : "",
            ]
              .filter(Boolean)
              .join(" ")}
            onClick={() => handleStarClick(i)}
          />
        );
      })}
    </div>
  );
};

export default StarRank;