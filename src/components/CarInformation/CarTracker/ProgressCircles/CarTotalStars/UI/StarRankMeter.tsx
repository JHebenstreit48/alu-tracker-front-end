import { CircularProgressbarWithChildren, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const backendBaseUrl = import.meta.env.VITE_CARS_API_BASE_URL;

interface StarRankMeterProps {
  rank: number;        // 1 to 6
  count: number;       // How many cars at this rank
  totalOwned: number;  // Total cars owned
}

export default function StarRankMeter({ rank, count, totalOwned }: StarRankMeterProps) {
  const percent = totalOwned > 0 ? (count / totalOwned) * 100 : 0;
  const starsArray = Array.from({ length: rank });

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
              src={`${backendBaseUrl}/images/icons/star.png`}
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