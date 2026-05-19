export type StageStat = {
  stage: number;
  rank: number;
  topSpeed: number;
  acceleration: number;
  handling: number;
  nitro: number;
};

export type StageStatInputState = {
  stage: number;
  rank: string;
  topSpeed: string;
  accel: string;
  handling: string;
  nitro: string;
};

export type StagesByStar = {
  oneStar?: StageStat[];
  twoStar?: StageStat[];
  threeStar?: StageStat[];
  fourStar?: StageStat[];
  fiveStar?: StageStat[];
  sixStar?: StageStat[];
};

export function emptyStageInput(stage: number): StageStatInputState {
  return { stage, rank: '', topSpeed: '', accel: '', handling: '', nitro: '' };
}

export function anyInStageInput(s: StageStatInputState): boolean {
  return [s.rank, s.topSpeed, s.accel, s.handling, s.nitro].some((v) => v.trim() !== '');
}