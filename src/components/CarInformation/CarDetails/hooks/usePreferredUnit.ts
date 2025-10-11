import { useEffect, useState } from "react";

export type UnitPref = "metric" | "imperial";
const STORAGE_KEY = "preferredUnit";

export function getPreferredUnit(): UnitPref {
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved === "imperial" ? "imperial" : "metric"; // default KPH
}

export default function usePreferredUnit() {
  const [unit, setUnit] = useState<UnitPref>(() => getPreferredUnit());
  useEffect(() => { localStorage.setItem(STORAGE_KEY, unit); }, [unit]);
  return { unit, setUnit };
}