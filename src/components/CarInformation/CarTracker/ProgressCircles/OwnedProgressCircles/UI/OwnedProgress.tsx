import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

interface OwnedProgressProps {
  ownedCount: number;
  totalCars: number;
}

export default function OwnedProgress({ ownedCount, totalCars }: OwnedProgressProps) {
  const percentage = totalCars > 0 ? (ownedCount / totalCars) * 100 : 0;

  return (
    <div className="ownedProgressWrapper">
      <CircularProgressbar
        className="ownedRing"
        value={percentage}
        text={`${Math.round(percentage)}%`}
        strokeWidth={12}
      />
    </div>
  );
}