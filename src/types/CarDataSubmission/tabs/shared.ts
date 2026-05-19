export type StatBlockState = {
  rank: string;
  topSpeed: string;
  accel: string;
  handling: string;
  nitro: string;
};

export type StageStatEntry = {
  stage: number;
  rank: string;
  topSpeed: string;
  accel: string;
  handling: string;
  nitro: string;
};

export const STAR_KEYS = [
  'oneStar', 'twoStar', 'threeStar', 'fourStar', 'fiveStar', 'sixStar',
] as const;

export type StarKey = (typeof STAR_KEYS)[number];

export const STAR_LABELS = ['1★', '2★', '3★', '4★', '5★', '6★'] as const;

export function toNum(s: string): number | undefined {
  const t = s.trim();
  if (!t) return undefined;
  const n = Number(t);
  return Number.isFinite(n) ? n : undefined;
}

export function emptyBlock(): StatBlockState {
  return { rank: '', topSpeed: '', accel: '', handling: '', nitro: '' };
}

export function emptyStageEntry(stage: number): StageStatEntry {
  return { stage, rank: '', topSpeed: '', accel: '', handling: '', nitro: '' };
}

export function anyInBlock(b: StatBlockState): boolean {
  return Object.values(b).some((v) => v.trim() !== '');
}

export function stageKeys(record: Record<string, unknown> | undefined): string[] {
  if (!record) return [];
  return Object.keys(record).sort((a, b) => Number(a) - Number(b));
}

export function carLabel(c: { brand: string; model: string; stars: number }): string {
  return `${c.brand} ${c.model} (${c.stars}★)`;
}

export function isAllZero(obj: Record<string, unknown>): boolean {
  return Object.values(obj).every((v) => v === 0 || v === null || v === undefined);
}