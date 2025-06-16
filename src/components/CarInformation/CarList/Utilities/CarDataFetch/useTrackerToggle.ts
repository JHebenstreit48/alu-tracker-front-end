import { useState, useEffect, useCallback } from "react";

export function useTrackerToggle() {
  const [trackerMode, setTrackerMode] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("trackerMode");
    setTrackerMode(saved === "true");
  }, []);

  const toggleTrackerMode = useCallback((value: boolean) => {
    setTrackerMode(value);
    localStorage.setItem("trackerMode", String(value));
  }, []);

  return {
    trackerMode,
    toggleTrackerMode,
  };
}