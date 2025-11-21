import "@/scss/Cars/CarsPage/index.scss";

interface Props {
  isEnabled: boolean;
  onToggle: (value: boolean) => void;
}

export default function CarTrackerToggle({ isEnabled, onToggle }: Props) {
  const handleClick = () => {
    const newValue = !isEnabled;
    console.log("🖱️ Toggle clicked. New Tracker Mode:", newValue);
    localStorage.setItem("trackerMode", String(newValue));
    onToggle(newValue);
  };

  return (
    <div className="trackerToggle">
      <button
        className={`trackerButton ${isEnabled ? "on pulse" : "off"}`}
        onClick={handleClick}
      >
        <span className="circleIndicator" />
        {isEnabled ? " Tracker On" : " Tracker Off"}
      </button>
    </div>
  );
}