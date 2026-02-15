import { useMemo } from "react";
import type { FullCar } from "@/types/shared/car";
import { buildStagesTables } from "@/utils/CarDetails/stages";

export function useStagesTables(car?: FullCar) {
  return useMemo(() => {
    const stages = (car as any)?.stages;
    return buildStagesTables(stages);
  }, [car]);
}