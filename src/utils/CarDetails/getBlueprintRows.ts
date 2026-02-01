import type { BlueprintsRow } from "@/types/CarDetails/Blueprints";

type BlueprintValue = number | string | null;

export function getBlueprintRows(car: Record<string, unknown>): BlueprintsRow[] {
  const rows = (Object.entries(car) as [string, unknown][])
    .map(([key, value]) => {
      const actual: BlueprintValue = Array.isArray(value) ? (value[0] as BlueprintValue) : (value as BlueprintValue);
      return { key, value: actual };
    })
    .filter((r) => r.key.startsWith("BPs_") && r.value !== null && (typeof r.value === "number" || typeof r.value === "string"))
    .map((r) => ({
      ...r,
      star: parseInt(r.key.match(/\d+/)?.[0] || "0", 10),
    }))
    .sort((a, b) => a.star - b.star);

  return rows;
}

export function sumNumericBlueprints(rows: BlueprintsRow[]): number {
  return rows.reduce((sum, r) => {
    if (typeof r.value === "number") return sum + r.value;
    if (typeof r.value === "string" && !isNaN(Number(r.value))) return sum + Number(r.value);
    return sum;
  }, 0);
}