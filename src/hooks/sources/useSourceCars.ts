import { useMemo } from "react";
import { mapToCatalog } from "@/utils/sources/normalizeSources";
import type { Car } from "@/types/shared/car";

export function useSourceCars(
  cars: Array<Car & Record<string, unknown>>,
  sourceLabel: string
): Car[] {
  return useMemo(() => {
    const target = mapToCatalog(sourceLabel);

    return cars.filter((car) => {
      const sources = car["sources"];
      if (!Array.isArray(sources)) return false;

      return sources.some((s: unknown) => {
        if (typeof s !== "string") return false;
        const matched = mapToCatalog(s);
        if (target && matched) return matched.key === target.key;
        return s.trim().toLowerCase() === sourceLabel.trim().toLowerCase();
      });
    });
  }, [cars, sourceLabel]);
}