import { CircularProgressbarWithChildren, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

import { getImageUrl } from "@/utils/shared/imageUrl";

interface StarRankMeterProps {
  rank: number;        // 1 to 6
  count: number;       // How many cars at this rank
  totalOwned: number;  // Total cars owned
}

// Relative path to the star icon in /public
const STAR_ICON_REL_PATH = "/images/icons/star.png";

export default function StarRankMeter({ rank, count, totalOwned }: StarRankMeterProps) {
  const percent = totalOwned > 0 ? (count / totalOwned) * 100 : 0;
  const starsArray = Array.from({ length: rank });

  const starIconUrl = getImageUrl(STAR_ICON_REL_PATH);

  return (
    <div className="starRankCircleWrapper">
      <CircularProgressbarWithChildren
        value={percent}
        strokeWidth={12}
        styles={buildStyles({
          pathColor: "gold",
          trailColor: "#333",
          textColor: "white",
        })}
      >
        <div className="starIconsContainer">
          {starsArray.map((_, idx) => (
            <img
              key={idx}
              src={starIconUrl}
              alt="Star"
              className="starIcon"
            />
          ))}
        </div>
        <div className="circleLabel">
          {Math.round(percent)}%
        </div>
      </CircularProgressbarWithChildren>
    </div>
  );
}