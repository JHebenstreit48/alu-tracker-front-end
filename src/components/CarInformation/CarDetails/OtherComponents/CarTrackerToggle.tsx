import { useEffect, useState } from "react";
import "@/SCSS/Cars/CarsPage/TrackerToggle.scss";

interface Props {
  isEnabled: boolean;
  onToggle: (value: boolean) => void;
}

export default function CarTrackerToggle({ isEnabled, onToggle }: Props) {
  const [internal, setInternal] = useState(isEnabled);

  useEffect(() => {
    setInternal(isEnabled);
  }, [isEnabled]);

  const handleClick = () => {
    const newValue = !internal;
    setInternal(newValue);
    localStorage.setItem("trackerMode", String(newValue));
    onToggle(newValue);
  };

  return (
    <div className="trackerToggle">
      <button
        className={`trackerButton ${internal ? "on pulse" : "off"}`}
        onClick={handleClick}
      >
        <span className="circleIndicator" />
        {internal ? " Tracker Mode On" : " Tracker Mode Off"}
      </button>
    </div>
  );
}
