import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

interface XpToNextLevelRingProps {
  percent: number;
}

export default function XpToNextLevelRing({ percent }: XpToNextLevelRingProps) {
  const safePercent = Number.isFinite(percent) ? Math.max(0, Math.min(percent, 100)) : 0;

  return (
    <div className="glRingWrapper glRingWrapperXp">
      <CircularProgressbar
        className="glRing glRingXp"
        value={safePercent}
        text={`${Math.round(safePercent)}%`}
        strokeWidth={12}
      />
    </div>
  );
}