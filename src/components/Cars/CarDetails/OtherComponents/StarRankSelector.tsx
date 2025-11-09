import { useEffect, useState } from "react";
import {
  getCarTrackingData,
  setCarTrackingData,
  generateCarKey,
} from "@/utils/shared/StorageUtils";
import { useAutoSyncDependency } from "@/hooks/UserDataSync/useAutoSync";

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
      setCarTrackingData(carKey, { ...data, stars: 1 }); // persist seed so it survives refresh
      setInternalStars(1);
    } else {
      setInternalStars(0);
    }
  }, [carKey, selected, trackerMode, isKeyCar]);

  // Debounced autosync (server when logged-in, local only when anon) for uncontrolled usage.
  useAutoSyncDependency(carKey && selected === undefined ? [internalStars] : []);

  const handleClick = (value: number) => {
    if (readOnly) return;

    // Clamp to [0, maxStars] just in case
    const next = Math.max(0, Math.min(maxStars, value));

    if (onSelect) {
      // Controlled mode: delegate up
      onSelect(next);
    } else {
      // Uncontrolled: update local state and persist
      setInternalStars(next);
      if (carKey) {
        setCarTrackingData(carKey, { stars: next });
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