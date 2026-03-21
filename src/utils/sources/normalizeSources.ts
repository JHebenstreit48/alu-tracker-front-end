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
    .replace(/[.]+$/g, "")
    .toLowerCase();
}

export function mapToCatalog(label: string): { key: string; label: string } | undefined {
  const norm = normalizeLabel(label);

  for (const item of sourcesCatalog) {
    if (normalizeLabel(item.label) === norm) return { key: item.key, label: item.label };
    const aliases = item.aliases ?? [];
    if (aliases.some((a) => normalizeLabel(a) === norm)) return { key: item.key, label: item.label };
  }

  return undefined;
}

export function dedupeAndCount(labels: string[]): DerivedSource[] {
  const map = new Map<string, DerivedSource>();

  for (const raw of labels) {
    const cleaned = raw?.trim();
    if (!cleaned) continue;

    const matched = mapToCatalog(cleaned);
    // Use the canonical catalog label as the key if matched, otherwise the cleaned raw label
    const key = matched ? matched.key : normalizeLabel(cleaned);
    const displayLabel = matched ? matched.label : cleaned.replace(/[.]+$/g, "");

    const existing = map.get(key);
    if (existing) {
      existing.count += 1;
      continue;
    }

    map.set(key, {
      label: displayLabel,
      count: 1,
      matchedCatalogKey: matched?.key,
    });
  }

  return Array.from(map.values()).sort((a, b) => b.count - a.count);
}