import { sourcesCatalog } from "@/data/sources/sourcesCatalog";

export type DerivedSource = {
  label: string;
  count: number;
  matchedCatalogKey?: string;
};

function normalizeLabel(s: string): string {
  return s
    .trim()
    .replace(/\s+/g, " ")
    .replace(/[.]+$/g, "") // drop trailing periods
    .toLowerCase();
}

export function mapToCatalog(label: string): string | undefined {
  const norm = normalizeLabel(label);

  for (const item of sourcesCatalog) {
    // direct label match
    if (normalizeLabel(item.label) === norm) return item.key;

    // alias match
    const aliases = item.aliases ?? [];
    if (aliases.some((a) => normalizeLabel(a) === norm)) return item.key;
  }

  return undefined;
}

export function dedupeAndCount(labels: string[]): DerivedSource[] {
  const map = new Map<string, DerivedSource>();

  for (const raw of labels) {
    const cleaned = raw?.trim();
    if (!cleaned) continue;

    const norm = normalizeLabel(cleaned);
    const existing = map.get(norm);

    if (existing) {
      existing.count += 1;
      continue;
    }

    map.set(norm, {
      label: cleaned.replace(/[.]+$/g, ""), // keep pretty but remove trailing dot
      count: 1,
      matchedCatalogKey: mapToCatalog(cleaned),
    });
  }

  return Array.from(map.values()).sort((a, b) => b.count - a.count);
}