import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

interface OverallCompletionRingProps {
  percent: number;
}

export default function OverallCompletionRing({
  percent,
}: OverallCompletionRingProps) {
  const safePercent = Number.isFinite(percent) ? Math.max(0, Math.min(percent, 100)) : 0;

  return (
    <div className="glRingWrapper glRingWrapperOverall">
      <CircularProgressbar
        className="glRing glRingOverall"
        value={safePercent}
        text={`${Math.round(safePercent)}%`}
        strokeWidth={12}
      />
    </div>
  );
}