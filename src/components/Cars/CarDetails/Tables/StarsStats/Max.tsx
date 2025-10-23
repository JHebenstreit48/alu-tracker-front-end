import { Car } from "@/components/Cars/CarDetails/Miscellaneous/Interfaces/Car";
import { MaxStarStats as MaxStarStatsIF } from "@/components/Cars/CarDetails/Miscellaneous/Interfaces/StarStats/MaxStarStats";
import { makeSpeedConverter, hasStats } from "@/components/Cars/CarDetails/Tables/StarsStats/utils/format";
import { getStatsFromCar, StarNumber } from "@/components/Cars/CarDetails/Tables/StarsStats/utils/getStarStats";
import StarHeader from "@/components/Cars/CarDetails/Tables/StarsStats/components/StarHeader";
import StarCard from "@/components/Cars/CarDetails/Tables/StarsStats/components/StarCard";

type Props = {
  car: Car & MaxStarStatsIF;
  unitPreference: "metric" | "imperial";
  trackerMode?: boolean;
};

export default function MaxStarTable({ car, unitPreference }: Props): JSX.Element {
  const toSpeed = makeSpeedConverter(unitPreference);

  const starsToRender: StarNumber[] = Array.from({ length: car.Stars }, (_, i) => (i + 1) as StarNumber)
    .filter((star) => !(car.Stars === 3 && star === 3)); // hide 3★ for 3★-max cars

  return (
    <>
      {starsToRender.map((star) => {
        const stats = getStatsFromCar(car, star);
        if (!hasStats(stats)) return null;
        return (
          <StarCard
            key={star}
            star={star}
            header={<StarHeader star={star} />}
            stats={stats}
            toSpeed={toSpeed}
          />
        );
      })}
    </>
  );
}