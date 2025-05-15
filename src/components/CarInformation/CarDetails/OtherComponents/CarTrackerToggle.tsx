interface Props {
    isEnabled: boolean;
    onToggle: (value: boolean) => void;
  }
  
  export default function CarTrackerToggle({ isEnabled, onToggle }: Props) {
    return (
      <div className="tracker-toggle">
        <label>
          <input
            type="checkbox"
            checked={isEnabled}
            onChange={(e) => onToggle(e.target.checked)}
          />
          Tracker Mode
        </label>
      </div>
    );
  }
  