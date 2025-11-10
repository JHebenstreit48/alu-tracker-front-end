import "@/scss/MiscellaneousStyle/StarRank.scss";
import { useEffect, useState } from "react";
import {
  getCarTrackingData,
  setCarTrackingData,
} from "@/utils/shared/StorageUtils";
import { useAutoSyncDependency } from "@/hooks/UserDataSync/useAutoSync";
import { getImageUrl } from "@/utils/shared/imageUrl";

interface StarRatingProps {
  count: number;
  trackerMode?: boolean;
  trackingKey?: string;
  isKeyCar?: boolean;
}

const STAR_ICON_SRC =
  getImageUrl("/images/icons/star.png") || "/images/icons/star.png";

const StarRank: React.FC<StarRatingProps> = ({
  count,
  trackerMode = false,
  trackingKey,
  isKeyCar,
}) => {
  const [selectedStars, setSelectedStars] = useState(0);

  useAutoSyncDependency([selectedStars]);

  useEffect(() => {
    if (trackerMode && trackingKey) {
      const data = getCarTrackingData(trackingKey);

      if (typeof data.stars === "number" && data.stars > 0) {
        setSelectedStars(data.stars);
      } else if (isKeyCar) {
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
        const classes = [
          "starIcon",
          trackerMode ? "clickable" : "",
          !isFilled && trackerMode ? "grayed" : "",
        ]
          .filter(Boolean)
          .join(" ");

        return (
          <img
            key={i}
            src={STAR_ICON_SRC}
            alt="Star"
            className={classes}
            onClick={() => handleStarClick(i)}
          />
        );
      })}
    </div>
  );
};

export default StarRank;