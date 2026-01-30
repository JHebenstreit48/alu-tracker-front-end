import { useCallback, useEffect, useState } from "react";

const LEVEL_KEY = "currentGarageLevel";
const XP_KEY = "currentXp";
const MODE_KEY = "garageLevelTrackerMode";

function safeNumber(raw: string | null, fallback: number): number {
  if (!raw) return fallback;
  const n = Number(raw.replace(/,/g, ""));
  return Number.isFinite(n) ? n : fallback;
}

function readSnapshot() {
  const level = safeNumber(localStorage.getItem(LEVEL_KEY), 1);
  const xp = safeNumber(localStorage.getItem(XP_KEY), 0);
  const mode = localStorage.getItem(MODE_KEY) || "default";

  return {
    currentGarageLevel: level > 0 ? level : 1,
    currentXp: xp >= 0 ? xp : 0,
    garageLevelTrackerMode: mode,
  };
}

export function useGarageLevelLocalSnapshot() {
  const [snap, setSnap] = useState(() => {
    if (typeof window === "undefined") {
      return { currentGarageLevel: 1, currentXp: 0, garageLevelTrackerMode: "default" };
    }
    return readSnapshot();
  });

  const refresh = useCallback(() => {
    if (typeof window === "undefined") return;
    setSnap(readSnapshot());
  }, []);

  useEffect(() => {
    // Fires for other tabs/windows
    const onStorage = (e: StorageEvent) => {
      if (e.key === LEVEL_KEY || e.key === XP_KEY || e.key === MODE_KEY) {
        refresh();
      }
    };

    window.addEventListener("storage", onStorage);

    // Same-tab writes don't trigger "storage", so ensure we read once on mount
    refresh();

    return () => window.removeEventListener("storage", onStorage);
  }, [refresh]);

  return { ...snap, refresh };
}