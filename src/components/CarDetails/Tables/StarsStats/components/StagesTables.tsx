import type { FullCar } from "@/types/shared/car";
import type { StagesStats, StarKey, StageStatLine } from "@/types/CarDetails/Stats/StagesStats";
import type { StatSnapshot } from "@/utils/CarDetails/format";
import { hasStats } from "@/utils/CarDetails/format";

import StatsCardTable from "@/components/CarDetails/Tables/StarsStats/components/StatsCardTable";
import StageHeader from "@/components/CarDetails/Tables/StarsStats/components/StageHeader";

type Props = {
  car: FullCar;
  unitPreference: "metric" | "imperial";
};

type StageRow = StageStatLine & { stage: number };

const STAR_KEYS: Array<{ key: StarKey; num: 1 | 2 | 3 | 4 | 5 | 6 }> = [
  { key: "oneStar", num: 1 },
  { key: "twoStar", num: 2 },
  { key: "threeStar", num: 3 },
  { key: "fourStar", num: 4 },
  { key: "fiveStar", num: 5 },
  { key: "sixStar", num: 6 },
];

function toStageRows(v: unknown): StageRow[] {
  if (!Array.isArray(v)) return [];

  return v
    .map((item, idx) => {
      const obj = item && typeof item === "object" ? (item as StageStatLine) : {};
      const stage = typeof obj.stage === "number" ? obj.stage : idx + 1; // default to 1-based if missing
      return { stage, ...obj };
    })
    .filter((r) => Number.isFinite(r.stage))
    .sort((a, b) => a.stage - b.stage);
}

function stageSnapshot(r: StageRow): StatSnapshot {
  return {
    rank: r.rank,
    topSpeed: r.topSpeed,
    acceleration: r.acceleration,
    handling: r.handling,
    nitro: r.nitro,
  };
}

export default function StagesTables({ car, unitPreference }: Props) {
  const stages = (car as any).stages as StagesStats | undefined;
  if (!stages) return null;

  const maxStars = Math.min(Math.max(car.stars ?? 0, 0), 6);

  const cards: Array<{ key: string; title: React.ReactNode; stats: StatSnapshot }> = [];

  for (const s of STAR_KEYS) {
    if (s.num > maxStars) break;

    const rows = toStageRows((stages as any)[s.key]);
    for (const row of rows) {
      const stats = stageSnapshot(row);
      if (!hasStats(stats)) continue;

      cards.push({
        key: `${s.key}-stage-${row.stage}`,
        title: <StageHeader stage={row.stage} />,
        stats,
      });
    }
  }

  if (!cards.length) return null;

  return (
    <>
      {cards.map((c) => (
        <StatsCardTable
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