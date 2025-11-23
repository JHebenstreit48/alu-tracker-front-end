import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

interface CurrentLevelRingProps {
  level: number;
  levelPercent: number;
}

export default function CurrentLevelRing({
  level,
  levelPercent,
}: CurrentLevelRingProps) {
  return (
    <div className="glRingWrapper glRingWrapperCurrent">
      <CircularProgressbar
        className="glRing glRingCurrent"
        value={levelPercent}
        text={`Lv ${level}`}
        strokeWidth={12}
      />
    </div>
  );
}