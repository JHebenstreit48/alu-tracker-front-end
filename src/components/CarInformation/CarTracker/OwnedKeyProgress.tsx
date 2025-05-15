import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

interface OwnedKeyProgressProps {
  obtained: number;
  total: number;
}

export default function OwnedKeyProgress({
  obtained,
  total,
}: OwnedKeyProgressProps) {
  const percentage = total > 0 ? (obtained / total) * 100 : 0;

  return (
    <div style={{ width: 150, height: 150 }}>
      <CircularProgressbar
        value={percentage}
        text={`${Math.round(percentage)}%`}
        strokeWidth={12}
        styles={buildStyles({
          pathColor: "#00ccff", // Bright blue
          trailColor: "#333",
          textColor: "#00ccff",
          textSize: "1.2rem",
        })}
      />
    </div>
  );
}
