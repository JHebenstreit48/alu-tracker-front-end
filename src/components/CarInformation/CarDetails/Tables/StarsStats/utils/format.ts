export type StatSnapshot = {
    rank?: number | string;
    topSpeed?: number | string;
    acceleration?: number | string;
    handling?: number | string;
    nitro?: number | string;
  };
  
  export const safeParse = (value: unknown): number => {
    if (typeof value === "number") return value;
    if (typeof value === "string" && value.trim() !== "" && !isNaN(Number(value))) {
      return Number(value);
    }
    return NaN;
  };
  
  // NEW: helper to treat numeric-like strings as valid
  export const isNumericish = (v: unknown): boolean =>
    typeof v === "number" || (typeof v === "string" && v.trim() !== "" && !isNaN(Number(v)));
  
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
  
  // CHANGE: use isNumericish instead of typeof v === "number"
  export const hasStats = (s?: StatSnapshot): boolean =>
    !!s && [s.rank, s.topSpeed, s.acceleration, s.handling, s.nitro].some(isNumericish);  