import type { FullCar } from "@/types/shared/car";
import type { GoldMaxStats, MaxStarStats, StockStats } from "@/types/CarDetails";
import type { StatSnapshot } from "@/utils/CarDetails/format";
import { hasStats } from "@/utils/CarDetails/format";
import { getStatsFromCar, type StarNumber } from "@/utils/CarDetails/getStarStats";

import StarHeader from "@/components/CarDetails/Tables/StarsStats/components/StarHeader";
import StatsTable from "@/components/CarDetails/Tables/StarsStats/components/StatsTable";

type Props = {
  car: FullCar;
  unitPreference: "metric" | "imperial";
};

function stockSnapshot(car: Partial<StockStats>): StatSnapshot {
  return {
    rank: car.stockRank,
    topSpeed: car.stockTopSpeed,
    acceleration: car.stockAcceleration,
    handling: car.stockHandling,
    nitro: car.stockNitro,
  };
}

function goldSnapshot(car: Partial<GoldMaxStats>): StatSnapshot {
  return {
    rank: car.goldMaxRank,
    topSpeed: car.goldTopSpeed,
    acceleration: car.goldAcceleration,
    handling: car.goldHandling,
    nitro: car.goldNitro,
  };
}

export default function StatsTables({ car, unitPreference }: Props) {
  const cards: Array<{ key: string; title: React.ReactNode; stats: StatSnapshot }> = [];

  const stock = stockSnapshot(car);
  if (hasStats(stock)) cards.push({ key: "stock", title: "Stock", stats: stock });

  const maxStars = Math.min(Math.max(car.stars ?? 0, 0), 6);
  for (let i = 1; i <= maxStars; i++) {
    const star = i as StarNumber;
    const stats = getStatsFromCar(car as FullCar & MaxStarStats, star);
    if (hasStats(stats)) {
      cards.push({ key: `star-${star}`, title: <StarHeader star={star} />, stats });
    }
  }

  const gold = goldSnapshot(car);
  if (hasStats(gold)) cards.push({ key: "gold", title: "Gold Max", stats: gold });

  if (cards.length === 0) return null;

  return (
    <>
      {cards.map((c) => (
        <StatsTable
          key={c.key}
          title={c.title}
          stats={c.stats}
          unitPreference={unitPreference}
          density="compact"
          className="statsTableCard"
        />
      ))}
    </>
  );
}