import type { FullCar } from "@/types/shared/car";
import type { MaxStarStats } from "@/types/CarDetails";
import type { StatSnapshot } from "@/utils/CarDetails/format";

export type StarNumber = 1 | 2 | 3 | 4 | 5 | 6;

type Num = number | undefined;

const pickNum = (car: unknown, key: string): Num => {
  const rec = car as Record<string, unknown> | null | undefined;
  const v = rec?.[key];
  return typeof v === "number" ? v : undefined;
};

const PREFIX: Record<StarNumber, string> = {
  1: "oneStarMax",
  2: "twoStarMax",
  3: "threeStarMax",
  4: "fourStarMax",
  5: "fiveStarMax",
  6: "sixStarMax",
};

export const getStatsFromCar = (
  car: FullCar & MaxStarStats,
  star: StarNumber
): StatSnapshot => {
  const p = PREFIX[star];

  return {
    rank: pickNum(car, `${p}Rank`),
    topSpeed: pickNum(car, `${p}TopSpeed`),
    acceleration: pickNum(car, `${p}Acceleration`),
    handling: pickNum(car, `${p}Handling`),
    nitro: pickNum(car, `${p}Nitro`),
  };
};