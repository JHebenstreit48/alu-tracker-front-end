import {
    CircularProgressbar,
    buildStyles,
  } from "react-circular-progressbar";
  import "react-circular-progressbar/dist/styles.css";
  
  interface GoldMaxedProgressProps {
    goldMaxedCount: number;
    totalCars: number;
  }
  
  export default function GoldMaxedProgress({ goldMaxedCount, totalCars }: GoldMaxedProgressProps) {
    const percentage = totalCars > 0 ? (goldMaxedCount / totalCars) * 100 : 0;
  
    return (
      <div className="goldMaxedProgressWrapper">
        <CircularProgressbar
          value={percentage}
          text={`${Math.round(percentage)}%`}
          strokeWidth={12}
          styles={buildStyles({
            pathColor: "#ffd700",     // Gold color
            trailColor: "#2c2c2c",    // Dark trail
            textColor: "#fffacd",     // Light cream for text
            textSize: "1.2rem",
          })}
        />
      </div>
    );
  }
  