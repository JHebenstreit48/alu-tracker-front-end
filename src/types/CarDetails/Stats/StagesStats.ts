export type StageStatLine = {
  // stage number for display + ordering
  stage?: number;

  rank?: number;
  topSpeed?: number;
  acceleration?: number;
  handling?: number;
  nitro?: number;
};

export type StarKey =
  | "oneStar"
  | "twoStar"
  | "threeStar"
  | "fourStar"
  | "fiveStar"
  | "sixStar";

/**
 * You can store stages either as:
 * 1) array: [{ stage: 3, ... }, { stage: 4, ... }]
 * 2) map: { "3": { ... }, "4": { ... } }
 *
 * Both support partial data while you migrate.
 */
export type StarStagesValue =
  | StageStatLine[]
  | Partial<Record<number | string, StageStatLine>>;

export type StagesStats = Partial<Record<StarKey, StarStagesValue>>;