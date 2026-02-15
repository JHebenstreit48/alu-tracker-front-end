import { useState } from "react";
import type { FullCar } from "@/types/shared/car";
import type { GoldMaxStats, MaxStarStats, StockStats } from "@/types/CarDetails";
import type { StatSnapshot } from "@/utils/CarDetails/format";
import { hasStats } from "@/utils/CarDetails/format";
import { getStatsFromCar, type StarNumber } from "@/utils/CarDetails/getStarStats";

import StarHeader from "@/components/CarDetails/Tables/StarsStats/components/StarHeader";
import StatsCardTable from "@/components/CarDetails/Tables/StarsStats/components/StatsCardTable";
import StatsModeToggle from "@/components/CarDetails/Tables/StarsStats/components/StatsModeToggle";
import StagesTables from "@/components/CarDetails/Tables/StarsStats/components/StagesTables";

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
  const [mode, setMode] = useState<"maxStar" | "stages">("maxStar");

  const stock = stockSnapshot(car);
  const gold = goldSnapshot(car);

  const maxStars = Math.min(Math.max(car.stars ?? 0, 0), 6);

  return (
    <>
      {/* full-width row so it never pushes cards around */}
      <div className="statsModeToggleRow">
        <StatsModeToggle mode={mode} onChange={setMode} />
      </div>

      {/* Stock always first */}
      {hasStats(stock) ? (
        <StatsCardTable
          title="Stock"
          stats={stock}
          unitPreference={unitPreference}
          density="compact"
          className="statsTableCard"
        />
      ) : null}

      {/* Middle section: max star OR stages */}
      {mode === "maxStar" ? (
        <>
          {Array.from({ length: maxStars }, (_, i) => i + 1).map((n) => {
            const star = n as StarNumber;
            const stats = getStatsFromCar(car as FullCar & MaxStarStats, star);
            if (!hasStats(stats)) return null;

            return (
              <StatsCardTable
                key={`star-${star}`}
                title={<StarHeader star={star} />}
                stats={stats}
                unitPreference={unitPreference}
                density="compact"
                className="statsTableCard"
              />
            );
          })}
        </>
      ) : (
        <StagesTables car={car} unitPreference={unitPreference} />
      )}

      {/* Gold always last */}
      {hasStats(gold) ? (
        <StatsCardTable
          title="Gold Max"
          stats={gold}
          unitPreference={unitPreference}
          density="compact"
          className="statsTableCard"
        />
      ) : null}
    </>
  );
}