import {
    CircularProgressbar,
    buildStyles,
  } from "react-circular-progressbar";
  import "react-circular-progressbar/dist/styles.css";
  
  interface OwnedProgressProps {
    ownedCount: number;
    totalCars: number;
  }
  
  export default function OwnedProgress({ ownedCount, totalCars }: OwnedProgressProps) {
    const percentage = totalCars > 0 ? (ownedCount / totalCars) * 100 : 0;
  
    return (
      <div style={{ width: 150, height: 150 }}>
        <CircularProgressbar
          value={percentage}
          text={`${Math.round(percentage)}%`}
          strokeWidth={12}
          styles={buildStyles({
            // Faux 3D style using shading colors
            pathColor: "#ffb347", // outer ring (orange-gold)
            trailColor: "#333",    // background ring
            textColor: "#ffe600",  // percentage label
            textSize: "1.2rem",
          })}
        />
      </div>
    );
  }
  