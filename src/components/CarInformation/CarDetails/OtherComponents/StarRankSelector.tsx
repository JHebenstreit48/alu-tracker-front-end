import { useEffect, useState } from "react";
import {
  getCarTrackingData,
  setCarTrackingData,
  generateCarKey,
} from "@/components/CarInformation/CarDetails/Miscellaneous/StorageUtils";
import { useAutoSyncDependency } from "@/components/CarInformation/UserDataSync/hooks/useAutoSync";

interface StarRankSelectorProps {
  maxStars: number;
  selected?: number; // Optional for controlled mode
  onSelect?: (value: number) => void;
  readOnly?: boolean;
  brand?: string;
  model?: string;
}

const StarRankSelector: React.FC<StarRankSelectorProps> = ({
  maxStars,
  selected,
  onSelect,
  readOnly = false,
  brand,
  model,
}) => {
  const [internalStars, setInternalStars] = useState<number>(0);

  const carKey =
    brand && model ? generateCarKey(brand, model) : null;

  // Load stars from localStorage if uncontrolled
  useEffect(() => {
    if (carKey && selected === undefined) {
      const data = getCarTrackingData(carKey);
      if (typeof data.stars === "number") {
        setInternalStars(data.stars);
      }
    }
  }, [carKey, selected]);

  // ✅ Auto-sync stars if uncontrolled and tracking by carKey
  useAutoSyncDependency(
    carKey && selected === undefined ? [internalStars] : []
  );

  const handleClick = (value: number) => {
    if (readOnly) return;

    if (onSelect) {
      onSelect(value); // Controlled mode
    } else {
      setInternalStars(value); // Uncontrolled mode
      if (carKey) {
        setCarTrackingData(carKey, { stars: value });
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
