export const STAGE_AT_STAR: Readonly<Record<number, number>> = {
  1: 3,
  2: 6,
  3: 8,
  4: 10,
  5: 12,
  6: 13,
};

export const GOLD_X = 14;

export interface StageCap {
  star: number;
  stage: number;
}

export function getStageCaps(maxStars: number): StageCap[] {
  const caps: StageCap[] = [];
  for (let star = 1; star <= maxStars; star += 1) {
    const stage = STAGE_AT_STAR[star];
    if (stage !== undefined) caps.push({ star, stage });
  }
  return caps;
}

export function getLastStage(maxStars: number): number {
  const caps = getStageCaps(maxStars);
  return caps.length > 0 ? caps[caps.length - 1].stage : 0;
}

export function starForBoundaryStage(stage: number, maxStars: number): number | null {
  const cap = getStageCaps(maxStars).find((c) => c.stage === stage);
  return cap ? cap.star : null;
}