import "@/SCSS/Cars/CarsPage/TrackerToggle.scss";

interface Props {
  isEnabled: boolean;
  onToggle: (value: boolean) => void;
}

export default function CarTrackerToggle({ isEnabled, onToggle }: Props) {
  const handleClick = () => {
    const newValue = !isEnabled;
    onToggle(newValue); // Notify parent
    localStorage.setItem("trackerMode", String(newValue)); // Persist toggle
  };

  return (
    <div className="trackerToggle">
      <button
        className={`trackerButton ${isEnabled ? "on pulse" : "off"}`}
        onClick={handleClick}
      >
        <span className="circleIndicator" />
        {isEnabled ? " Tracker Mode On" : " Tracker Mode Off"}
      </button>
    </div>
  );
}
