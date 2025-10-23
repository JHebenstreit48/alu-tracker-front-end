export type StatSnapshot = {
  rank?: number | string | null;
  topSpeed?: number | string | null;
  acceleration?: number | string | null;
  handling?: number | string | null;
  nitro?: number | string | null;
};

export const safeParse = (value: unknown): number => {
  if (typeof value === "number") return value;
  if (typeof value === "string" && value.trim() !== "" && !isNaN(Number(value))) {
    return Number(value);
  }
  return NaN;
};

// numeric-like = number OR numeric string such as "123.45"
export const isNumericish = (v: unknown): boolean =>
  typeof v === "number" || (typeof v === "string" && v.trim() !== "" && !isNaN(Number(v)));

// present = not null/undefined and not an empty string
const isPresent = (v: unknown): boolean =>
  v !== null && v !== undefined && !(typeof v === "string" && v.trim() === "");

// Formats a number-ish value; anything non-numeric becomes "—"
export const fmt = (v?: unknown, d = 2): string => {
  const n = safeParse(v);
  return !isNaN(n) ? n.toFixed(d) : "—";
};

export const makeSpeedConverter =
  (unit: "metric" | "imperial") =>
  (value: unknown): string => {
    const n = safeParse(value);
    if (isNaN(n)) return "—";
    return unit === "imperial" ? `${(n * 0.621371).toFixed(1)} mph` : `${n.toFixed(1)} km/h`;
  };

/**
 * KEY CHANGE:
 * We now render a star card if ANY field is "present" (including strings like "Unknown"),
 * not only if a field is numeric. Cells still display "—" when non-numeric.
 */
export const hasStats = (s?: StatSnapshot): boolean =>
  !!s && [s.rank, s.topSpeed, s.acceleration, s.handling, s.nitro].some(isPresent);