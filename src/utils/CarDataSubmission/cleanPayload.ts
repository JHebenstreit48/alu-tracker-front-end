export function deepClean<T>(value: T): T {
  if (Array.isArray(value)) {
    const arr = value
      .map((v) => deepClean(v))
      .filter((v) => v !== undefined && v !== null) as any;
    return arr as T;
  }

  if (value && typeof value === "object") {
    const out: any = {};
    for (const [k, v] of Object.entries(value as any)) {
      const cleaned = deepClean(v);

      const isEmptyObj =
        cleaned &&
        typeof cleaned === "object" &&
        !Array.isArray(cleaned) &&
        Object.keys(cleaned as any).length === 0;

      if (cleaned === undefined || cleaned === null) continue;
      if (isEmptyObj) continue;

      out[k] = cleaned;
    }
    return out;
  }

  if (typeof value === "string") {
    const s = value.trim();
    return (s === "" ? (undefined as any) : (s as any)) as T;
  }

  return value;
}