import type { StageStatLine, StarKey, StagesStats, StarStagesValue } from "@/types/CarDetails/Stats/StagesStats";

export type StageRow = StageStatLine & { stage: number };

export type StarStagesTable = {
  starKey: StarKey;
  starLabel: string; // ★, ★★, etc
  rows: StageRow[];
};

const STAR_KEYS: StarKey[] = ["oneStar", "twoStar", "threeStar", "fourStar", "fiveStar", "sixStar"];

function normalizeRows(v?: StarStagesValue): StageRow[] {
  if (!v) return [];

  // Array form: [{stage?: number, ...}, ...]
  if (Array.isArray(v)) {
    return v
      .map((item, idx) => {
        const stage = typeof item.stage === "number" ? item.stage : idx;
        const { stage: _ignored, ...rest } = item;
        return { stage, ...rest };
      })
      .filter((r) => Number.isFinite(r.stage))
      .sort((a, b) => a.stage - b.stage);
  }

  // Map form: { "3": {...}, 4: {...} }
  return Object.entries(v)
    .map(([k, val]) => {
      const stage = Number(k);
      return Number.isFinite(stage) ? ({ stage, ...(val ?? {}) } as StageRow) : null;
    })
    .filter((x): x is StageRow => !!x)
    .sort((a, b) => a.stage - b.stage);
}

export function buildStagesTables(stages?: StagesStats): StarStagesTable[] {
  if (!stages) return [];

  return STAR_KEYS
    .map((starKey, idx) => {
      const rows = normalizeRows(stages[starKey]);
      return {
        starKey,
        starLabel: "★".repeat(idx + 1),
        rows,
      };
    })
    .filter((t) => t.rows.length > 0);
}