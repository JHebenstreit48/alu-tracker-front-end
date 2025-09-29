import { useEffect, useState, useCallback } from "react";

const KEY = "trackerMode";

export function useTrackerMode() {
  const [trackerMode, setTrackerMode] = useState<boolean>(
    () => localStorage.getItem(KEY) === "true"
  );

  useEffect(() => {
    const sync = () => setTrackerMode(localStorage.getItem(KEY) === "true");
    const onStorage = (e: StorageEvent) => { if (e.key === KEY) sync(); };
    window.addEventListener("storage", onStorage);
    // ensure latest on mount as well
    sync();
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const toggleTrackerMode = useCallback((val?: boolean) => {
    const next = typeof val === "boolean" ? val : !trackerMode;
    localStorage.setItem(KEY, String(next));
    setTrackerMode(next);
  }, [trackerMode]);

  return { trackerMode, toggleTrackerMode };
}