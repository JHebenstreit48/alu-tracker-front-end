import { CircularProgressbar } from "react-circular-progressbar";
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
        className="goldMaxedRing"
        value={percentage}
        text={`${Math.round(percentage)}%`}
        strokeWidth={12}
      />
    </div>
  );
}