export type DeltaStatBlock = {
  topSpeed?: number;
  acceleration?: number;
  handling?: number;
  nitro?: number;
};

export type DeltaEntry = {
  stage: number;
  rarity?: string;
  rankByStat?: DeltaStatBlock;
  statByStat?: DeltaStatBlock;
};

export type DeltasByStar = {
  oneStar?: DeltaEntry[];
  twoStar?: DeltaEntry[];
  threeStar?: DeltaEntry[];
  fourStar?: DeltaEntry[];
  fiveStar?: DeltaEntry[];
  sixStar?: DeltaEntry[];
};

export type DeltaRowState = {
  stage: number;
  rankTopSpeed: string;
  rankAccel: string;
  rankHandling: string;
  rankNitro: string;
  statTopSpeed: string;
  statAccel: string;
  statHandling: string;
  statNitro: string;
};

export type ImportDeltaRowState = {
  stage: number;
  rarity: string;
  rankTopSpeed: string;
  rankAccel: string;
  rankHandling: string;
  rankNitro: string;
  statTopSpeed: string;
  statAccel: string;
  statHandling: string;
  statNitro: string;
};

export type DeltasState = DeltaRowState[][];
export type ImportDeltasState = ImportDeltaRowState[][];

export function emptyDeltaRow(stage: number): DeltaRowState {
  return {
    stage,
    rankTopSpeed: '', rankAccel: '', rankHandling: '', rankNitro: '',
    statTopSpeed: '', statAccel: '', statHandling: '', statNitro: '',
  };
}

export function emptyImportDeltaRow(stage: number, rarity = ''): ImportDeltaRowState {
  return {
    stage,
    rarity,
    rankTopSpeed: '', rankAccel: '', rankHandling: '', rankNitro: '',
    statTopSpeed: '', statAccel: '', statHandling: '', statNitro: '',
  };
}

export function anyInDeltaRow(row: DeltaRowState | ImportDeltaRowState): boolean {
  return [
    row.rankTopSpeed, row.rankAccel, row.rankHandling, row.rankNitro,
    row.statTopSpeed, row.statAccel, row.statHandling, row.statNitro,
  ].some((v) => v.trim() !== '');
}

export function initDeltasState(rows = 3): DeltasState {
  return ['oneStar','twoStar','threeStar','fourStar','fiveStar','sixStar'].map(() =>
    Array(rows).fill(null).map((_, i) => emptyDeltaRow(i + 1))
  );
}