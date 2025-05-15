import "@/SCSS/Cars/CarsPage/TrackerToggle.scss";

interface Props {
  isEnabled: boolean;
  onToggle: (value: boolean) => void;
}

export default function CarTrackerToggle({ isEnabled, onToggle }: Props) {
  return (
    <div className="trackerToggle">
      <button
        className={`trackerButton ${isEnabled ? "on pulse" : "off"}`}
        onClick={() => onToggle(!isEnabled)}
      >
        <span className="circleIndicator" />
        {isEnabled ? " Tracker Mode On" : " Tracker Mode Off"}
      </button>
    </div>
  );
}
