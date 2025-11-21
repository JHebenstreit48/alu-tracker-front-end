import { useEffect, useState } from "react";
import {
  getCarTrackingData,
  generateCarKey,
} from "@/utils/shared/StorageUtils";
import { setCarTrackingDataWithSync } from "@/utils/CarDetails/SyncStorageUtils";

interface StarRankSelectorProps {
  maxStars: number;
  selected?: number; // Controlled mode if provided
  onSelect?: (value: number) => void;
  readOnly?: boolean;
  brand?: string;
  model?: string;
  trackerMode?: boolean;
  isKeyCar?: boolean;
}

const StarRankSelector: React.FC<StarRankSelectorProps> = ({
  maxStars,
  selected,
  onSelect,
  readOnly = false,
  brand,
  model,
  trackerMode = false,
  isKeyCar = false,
}) => {
  const [internalStars, setInternalStars] = useState<number>(0);

  const carKey = brand && model ? generateCarKey(brand, model) : null;

  // Load stars from localStorage if uncontrolled; seed key cars to 1★ in tracker mode if missing.
  useEffect(() => {
    if (!carKey || selected !== undefined) return;

    const data = getCarTrackingData(carKey);

    if (Number.isInteger(data.stars) && (data.stars as number) > 0) {
      setInternalStars(data.stars as number);
      return;
    }

    // One-time seeding for key cars in tracker mode when no stars exist yet.
    if (trackerMode && isKeyCar) {
      const next = { ...data, stars: 1 };
      setInternalStars(1);
      void setCarTrackingDataWithSync(carKey, next); // persist + sync
    } else {
      setInternalStars(0);
    }
  }, [carKey, selected, trackerMode, isKeyCar]);

  const handleClick = (starValue: number) => {
    if (readOnly) return;

    const current = selected ?? internalStars;

    // Clicking the same star again clears back to 0
    let nextValue = starValue === current ? 0 : starValue;
    nextValue = Math.max(0, Math.min(maxStars, nextValue));

    if (onSelect) {
      // Controlled mode: delegate up
      onSelect(nextValue);
    } else {
      // Uncontrolled: update local state and persist + sync
      setInternalStars(nextValue);

      if (carKey) {
        const existing = getCarTrackingData(carKey);
        const next = { ...existing, stars: nextValue };
        void setCarTrackingDataWithSync(carKey, next);
      }
    }
  };

  const displayStars = selected ?? internalStars;

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      {[...Array(maxStars)].map((_, i) => {
        const starValue = i + 1;
        const isSelected = i < displayStars;
        return (
          <span
            key={i}
            onClick={() => handleClick(starValue)}
            style={{
              cursor: readOnly ? "default" : "pointer",
              fontSize: "2rem",
              color: isSelected ? "gold" : "gray",
              opacity: isSelected ? 1 : 0.4,
              marginRight: "4px",
            }}
            aria-label={`${starValue} star${starValue > 1 ? "s" : ""}`}
            role={readOnly ? undefined : "button"}
          >
            ★
          </span>
        );
      })}
    </div>
  );
};

export default StarRankSelector;