import type { Car } from '@/types/shared/car';
import { carLabel } from '@/types/CarDataSubmission/tabs/shared';

type Props = {
  selectedCars: Car[];
  activeIdx: number;
  onSelect: (i: number) => void;
  onRemove: (key: string) => void;
};

export default function CarChipSelector({ selectedCars, activeIdx, onSelect, onRemove }: Props) {
  if (selectedCars.length <= 1) return null;

  const safeIdx = Math.min(activeIdx, Math.max(0, selectedCars.length - 1));

  return (
    <div className="StatsCarSelector">
      <span className="StatsCarSelector__label">Editing:</span>
      <div className="StatsCarSelector__chips">
        {selectedCars.map((c, i) => (
          <div
            key={c.normalizedKey ?? String(c.id)}
            className={`StatsCarChip${i === safeIdx ? ' StatsCarChip--active' : ''}`}
          >
            <button
              type="button"
              className="StatsCarChip__label"
              onClick={() => onSelect(i)}
            >
              {carLabel(c)}
            </button>
            <button
              type="button"
              className="StatsCarChip__remove"
              onClick={() => onRemove(c.normalizedKey ?? String(c.id))}
              aria-label={`Remove ${carLabel(c)}`}
            >
              ×
            </button>
          </div>
        ))}
      </div>
      <div className="StatsCarSelector__nav">
        <button
          type="button"
          className="StatsCarNav"
          onClick={() => onSelect(Math.max(0, activeIdx - 1))}
          disabled={safeIdx === 0}
        >‹</button>
        <button
          type="button"
          className="StatsCarNav"
          onClick={() => onSelect(Math.min(selectedCars.length - 1, activeIdx + 1))}
          disabled={safeIdx === selectedCars.length - 1}
        >›</button>
      </div>
    </div>
  );
}