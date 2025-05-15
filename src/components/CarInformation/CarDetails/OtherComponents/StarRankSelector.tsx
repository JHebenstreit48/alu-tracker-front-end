import { useEffect, useState } from "react";
import {
  getCarTrackingData,
  setCarTrackingData,
} from "@/components/CarInformation/CarDetails/Miscellaneous/StorageUtils";

interface StarRankSelectorProps {
  maxStars: number;
  selected?: number; // Optional for uncontrolled mode
  onSelect?: (value: number) => void;
  readOnly?: boolean;
  carId?: string; // Optional – triggers auto-persistence
}

const StarRankSelector: React.FC<StarRankSelectorProps> = ({
  maxStars,
  selected,
  onSelect,
  readOnly = false,
  carId,
}) => {
  const [internalStars, setInternalStars] = useState<number>(0);

  // Load from localStorage only if uncontrolled
  useEffect(() => {
    if (carId && selected === undefined) {
      const data = getCarTrackingData(carId);
      if (typeof data.stars === "number") {
        setInternalStars(data.stars);
      }
    }
  }, [carId, selected]);

  const handleClick = (value: number) => {
    if (readOnly) return;

    if (onSelect) {
      onSelect(value);
    } else {
      setInternalStars(value);
      if (carId) {
        setCarTrackingData(carId, { stars: value });
      }
    }
  };

  const displayStars = selected ?? internalStars;

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      {[...Array(maxStars)].map((_, i) => {
        const isSelected = i < displayStars;
        return (
          <span
            key={i}
            onClick={() => handleClick(i + 1)}
            style={{
              cursor: readOnly ? "default" : "pointer",
              fontSize: "2rem",
              color: isSelected ? "gold" : "gray",
              opacity: isSelected ? 1 : 0.4,
              marginRight: "4px",
            }}
          >
            ★
          </span>
        );
      })}
    </div>
  );
};

export default StarRankSelector;
