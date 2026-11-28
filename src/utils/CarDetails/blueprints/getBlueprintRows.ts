import type { BlueprintsRow } from "@/types/CarDetails/blueprints";

type BlueprintValue = number | string | null;

function unwrap(v: unknown): BlueprintValue {
  if (Array.isArray(v)) return (v[0] as BlueprintValue) ?? null;
  return (v as BlueprintValue) ?? null;
}

function parseStarFromKey(key: string): number {
  const m = key.match(/\d+/);
  return m ? parseInt(m[0], 10) : 0;
}

export function getBlueprintRows(car: Record<string, unknown>): BlueprintsRow[] {
  const byStar = new Map<number, BlueprintsRow>();

  for (const [key, raw] of Object.entries(car)) {
    const value = unwrap(raw);
    if (value === null || value === undefined) continue;
    if (!(typeof value === "number" || typeof value === "string")) continue;

    const isLegacy = key.startsWith("BPs_");
    const isModern = key.startsWith("blueprints") && key.endsWith("Star");
    if (!isLegacy && !isModern) continue;

    const star = parseStarFromKey(key);
    if (!star) continue;

    const existing = byStar.get(star);

    // Prefer legacy keys if both exist for the same star.
    if (!existing) {
      byStar.set(star, { key: `bp_${star}`, star, value });
      continue;
    }

    const existingWasLegacy = existing.key.startsWith("BPs_") || existing.key.startsWith("bp_legacy_");

    if (isLegacy && !existingWasLegacy) {
      byStar.set(star, { key: `bp_${star}`, star, value });
    }
    // else keep existing
  }

  return Array.from(byStar.values()).sort((a, b) => a.star - b.star);
}

export function sumNumericBlueprints(rows: BlueprintsRow[]): number {
  return rows.reduce((sum, r) => {
    if (typeof r.value === "number") return sum + r.value;
    if (typeof r.value === "string" && r.value.trim() !== "" && !isNaN(Number(r.value))) {
      return sum + Number(r.value);
    }
    return sum;
  }, 0);
}