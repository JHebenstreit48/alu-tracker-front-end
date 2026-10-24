import { sourcesCatalog } from "@/data/sources/sourcesCatalog";
import type { SourcesCatalogItem } from "@/types/sources/source";

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

function matchesItem(item: SourcesCatalogItem, norm: string): boolean {
  if (normalizeLabel(item.label) === norm) return true;
  if (item.aliases?.some((a) => normalizeLabel(a) === norm)) return true;
  if (item.prefixes?.some((p) => norm.startsWith(normalizeLabel(p)))) return true;
  return false;
}

export function mapToCatalog(label: string): { key: string; label: string } | undefined {
  const norm = normalizeLabel(label);

  for (const item of sourcesCatalog) {
    if (matchesItem(item, norm)) return { key: item.key, label: item.label };
  }

  return undefined;
}

export function dedupeAndCount(labels: string[]): DerivedSource[] {
  const map = new Map<string, DerivedSource>();

  for (const raw of labels) {
    const cleaned = raw?.trim();
    if (!cleaned) continue;

    const matched = mapToCatalog(cleaned);
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