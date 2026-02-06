import { Car } from "@/types/shared/car";
import { MaxStarStats as MaxStarStatsIF } from "@/types/CarDetails";
import type { StatSnapshot } from "@/utils/CarDetails/format";

export type StarNumber = 1 | 2 | 3 | 4 | 5 | 6;

const p = (car: any, legacy: string, modern: string) => car?.[legacy] ?? car?.[modern];

export const getStatsFromCar = (
  car: Car & MaxStarStatsIF,
  star: StarNumber
): StatSnapshot => {
  switch (star) {
    case 1:
      return {
        rank: p(car, "One_Star_Max_Rank", "oneStarMaxRank"),
        topSpeed: p(car, "One_Star_Max_Top_Speed", "oneStarMaxTopSpeed"),
        acceleration: p(car, "One_Star_Max_Acceleration", "oneStarMaxAcceleration"),
        handling: p(car, "One_Star_Max_Handling", "oneStarMaxHandling"),
        nitro: p(car, "One_Star_Max_Nitro", "oneStarMaxNitro"),
      };
    case 2:
      return {
        rank: p(car, "Two_Star_Max_Rank", "twoStarMaxRank"),
        topSpeed: p(car, "Two_Star_Max_Top_Speed", "twoStarMaxTopSpeed"),
        acceleration: p(car, "Two_Star_Max_Acceleration", "twoStarMaxAcceleration"),
        handling: p(car, "Two_Star_Max_Handling", "twoStarMaxHandling"),
        nitro: p(car, "Two_Star_Max_Nitro", "twoStarMaxNitro"),
      };
    case 3:
      return {
        rank: p(car, "Three_Star_Max_Rank", "threeStarMaxRank"),
        topSpeed: p(car, "Three_Star_Max_Top_Speed", "threeStarMaxTopSpeed"),
        acceleration: p(car, "Three_Star_Max_Acceleration", "threeStarMaxAcceleration"),
        handling: p(car, "Three_Star_Max_Handling", "threeStarMaxHandling"),
        nitro: p(car, "Three_Star_Max_Nitro", "threeStarMaxNitro"),
      };
    case 4:
      return {
        rank: p(car, "Four_Star_Max_Rank", "fourStarMaxRank"),
        topSpeed: p(car, "Four_Star_Max_Top_Speed", "fourStarMaxTopSpeed"),
        acceleration: p(car, "Four_Star_Max_Acceleration", "fourStarMaxAcceleration"),
        handling: p(car, "Four_Star_Max_Handling", "fourStarMaxHandling"),
        nitro: p(car, "Four_Star_Max_Nitro", "fourStarMaxNitro"),
      };
    case 5:
      return {
        rank: p(car, "Five_Star_Max_Rank", "fiveStarMaxRank"),
        topSpeed: p(car, "Five_Star_Max_Top_Speed", "fiveStarMaxTopSpeed"),
        acceleration: p(car, "Five_Star_Max_Acceleration", "fiveStarMaxAcceleration"),
        handling: p(car, "Five_Star_Max_Handling", "fiveStarMaxHandling"),
        nitro: p(car, "Five_Star_Max_Nitro", "fiveStarMaxNitro"),
      };
    case 6:
      return {
        rank: p(car, "Six_Star_Max_Rank", "sixStarMaxRank"),
        topSpeed: p(car, "Six_Star_Max_Top_Speed", "sixStarMaxTopSpeed"),
        acceleration: p(car, "Six_Star_Max_Acceleration", "sixStarMaxAcceleration"),
        handling: p(car, "Six_Star_Max_Handling", "sixStarMaxHandling"),
        nitro: p(car, "Six_Star_Max_Nitro", "sixStarMaxNitro"),
      };
  }
};