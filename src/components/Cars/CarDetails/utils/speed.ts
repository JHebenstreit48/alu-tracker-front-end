import type { UnitPref } from "@/hooks/CarDetails/usePreferredUnit";

export const KPH_TO_MPH = 0.621371;

export function kphToMph(kph: number): number {
  return kph * KPH_TO_MPH;
}

/** Format only Top_Speed-type numbers for display */
export function formatSpeed(valueKph: number, unit: UnitPref, locale?: string): string {
  const val = unit === "imperial" ? kphToMph(valueKph) : valueKph;

  // 1 decimal like your dataset (e.g., 418.2)
  const rounded = Math.round(val * 10) / 10;

  // Periods by default; can pass a locale later for comma regions
  return rounded.toLocaleString(locale ?? "en-US", { maximumFractionDigits: 1, minimumFractionDigits: 1 });
}