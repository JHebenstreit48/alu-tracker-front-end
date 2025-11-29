import { Car } from "@/types/shared/car";
import { MaxStarStats as MaxStarStatsIF } from "@/types/CarDetails";
import type { StatSnapshot } from "@/utils/CarDetails/format";

export type StarNumber = 1 | 2 | 3 | 4 | 5 | 6;

/**
 * Strongly-typed accessor (no `any`, no index trickery).
 * Switch keeps the compiler happy & avoids template-literal gymnastics.
 */
export const getStatsFromCar = (
  car: Car & MaxStarStatsIF,
  star: StarNumber
): StatSnapshot => {
  switch (star) {
    case 1:
      return {
        rank: car.One_Star_Max_Rank,
        topSpeed: car.One_Star_Max_Top_Speed,
        acceleration: car.One_Star_Max_Acceleration,
        handling: car.One_Star_Max_Handling,
        nitro: car.One_Star_Max_Nitro,
      };
    case 2:
      return {
        rank: car.Two_Star_Max_Rank,
        topSpeed: car.Two_Star_Max_Top_Speed,
        acceleration: car.Two_Star_Max_Acceleration,
        handling: car.Two_Star_Max_Handling,
        nitro: car.Two_Star_Max_Nitro,
      };
    case 3:
      return {
        rank: car.Three_Star_Max_Rank,
        topSpeed: car.Three_Star_Max_Top_Speed,
        acceleration: car.Three_Star_Max_Acceleration,
        handling: car.Three_Star_Max_Handling,
        nitro: car.Three_Star_Max_Nitro,
      };
    case 4:
      return {
        rank: car.Four_Star_Max_Rank,
        topSpeed: car.Four_Star_Max_Top_Speed,
        acceleration: car.Four_Star_Max_Acceleration,
        handling: car.Four_Star_Max_Handling,
        nitro: car.Four_Star_Max_Nitro,
      };
    case 5:
      return {
        rank: car.Five_Star_Max_Rank,
        topSpeed: car.Five_Star_Max_Top_Speed,
        acceleration: car.Five_Star_Max_Acceleration,
        handling: car.Five_Star_Max_Handling,
        nitro: car.Five_Star_Max_Nitro,
      };
    case 6:
      return {
        rank: car.Six_Star_Max_Rank,
        topSpeed: car.Six_Star_Max_Top_Speed,
        acceleration: car.Six_Star_Max_Acceleration,
        handling: car.Six_Star_Max_Handling,
        nitro: car.Six_Star_Max_Nitro,
      };
  }
};