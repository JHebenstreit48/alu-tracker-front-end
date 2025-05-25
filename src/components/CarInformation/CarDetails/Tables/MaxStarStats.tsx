import React from "react";
import { Car } from "@/components/CarInformation/CarDetails/Miscellaneous/Interfaces/Car";
import { MaxStarStats } from "@/components/CarInformation/CarDetails/Miscellaneous/Interfaces/StarStats/MaxStarStats";

interface MaxStarStatsProps {
  car: Car & MaxStarStats;
  unitPreference: "metric" | "imperial";
  trackerMode?: boolean;
}

interface StarStats {
  rank?: number;
  topSpeed?: number;
  acceleration?: number;
  handling?: number;
  nitro?: number;
}

const MaxStarStatsTable: React.FC<MaxStarStatsProps> = ({ car, unitPreference }) => {
  const safeParse = (value: unknown): number => (typeof value === "number" ? value : 0);

  const convertTopSpeed = (value: unknown): string => {
    const speed = safeParse(value);
    const conversionFactor = 0.6214;
    return unitPreference === "imperial"
      ? `${(speed * conversionFactor).toFixed(1)} mph`
      : `${speed.toFixed(1)} km/h`;
  };

  const formatStat = (value: unknown): string => {
    return safeParse(value).toFixed(2);
  };

  const getStatsForStar = (star: number): StarStats => {
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
      default:
        return {};
    }
  };

  const getStarHeader = (star: number): JSX.Element => {
    const baseUrl = import.meta.env.VITE_API_BASE_URL ?? "";
    const plural = star > 1 ? "Stars Max" : "Star Max";

    return (
      <div className="starHeaderWrapper">
        <div className="starIconWrapper">
          {Array.from({ length: star }).map((_, i) => (
            <img
              key={i}
              src={`${baseUrl}/images/icons/star.png`}
              alt="Star"
              className="starIcon"
            />
          ))}
        </div>
        <span className="starLabel">{plural}</span>
      </div>
    );
  };

  const renderStatTable = (star: number): JSX.Element => {
    const stats = getStatsForStar(star);
  
    return (
      <div className="tableCard" key={star}>
        <table className="carInfoTable">
          <thead>
            <tr>
              <th className="tableHeader2" colSpan={2}>
                {getStarHeader(star)}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Rank</td>
              <td>{typeof stats.rank === "number" ? stats.rank : "—"}</td>
            </tr>
            <tr>
              <td>Top Speed</td>
              <td>{convertTopSpeed(stats.topSpeed)}</td>
            </tr>
            <tr>
              <td>Acceleration</td>
              <td>{formatStat(stats.acceleration)}</td>
            </tr>
            <tr>
              <td>Handling</td>
              <td>{formatStat(stats.handling)}</td>
            </tr>
            <tr>
              <td>Nitro</td>
              <td>{formatStat(stats.nitro)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  };  

  return (
    <>
      {Array.from({ length: car.Stars }, (_, i) => renderStatTable(i + 1))}
    </>
  );
  
};

export default MaxStarStatsTable;
