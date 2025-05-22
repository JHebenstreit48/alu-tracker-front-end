import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

interface OwnedKeyProgressProps {
  obtained: number;
  total: number;
}

export default function OwnedKeyProgress({ obtained, total }: OwnedKeyProgressProps) {
  const percentage = total > 0 ? (obtained / total) * 100 : 0;

  return (
    <div className="ownedKeyProgressWrapper">
      <CircularProgressbar
        className="ownedKeyRing"
        value={percentage}
        text={`${Math.round(percentage)}%`}
        strokeWidth={12}
      />
    </div>
  );
}
