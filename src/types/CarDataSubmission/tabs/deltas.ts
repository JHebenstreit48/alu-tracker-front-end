export type DeltaStatBlock = {
  topSpeed?: number;
  acceleration?: number;
  handling?: number;
  nitro?: number;
};

export type DeltaEntry = {
  stage: number;
  rarity?: string;
  cardsAppliedByStat?: DeltaStatBlock;
  statDeltaByStat?: DeltaStatBlock;
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
  cardsTopSpeed: string;
  cardsAccel: string;
  cardsHandling: string;
  cardsNitro: string;
  deltaTopSpeed: string;
  deltaAccel: string;
  deltaHandling: string;
  deltaNitro: string;
};

export type ImportDeltaRowState = {
  stage: number;
  rarity: string;
  cardsTopSpeed: string;
  cardsAccel: string;
  cardsHandling: string;
  cardsNitro: string;
  deltaTopSpeed: string;
  deltaAccel: string;
  deltaHandling: string;
  deltaNitro: string;
};

export type DeltasState = DeltaRowState[][];
export type ImportDeltasState = ImportDeltaRowState[][];

export function emptyDeltaRow(stage: number): DeltaRowState {
  return {
    stage,
    cardsTopSpeed: '', cardsAccel: '', cardsHandling: '', cardsNitro: '',
    deltaTopSpeed: '', deltaAccel: '', deltaHandling: '', deltaNitro: '',
  };
}

export function emptyImportDeltaRow(stage: number, rarity = ''): ImportDeltaRowState {
  return {
    stage,
    rarity,
    cardsTopSpeed: '', cardsAccel: '', cardsHandling: '', cardsNitro: '',
    deltaTopSpeed: '', deltaAccel: '', deltaHandling: '', deltaNitro: '',
  };
}

export function anyInDeltaRow(row: DeltaRowState | ImportDeltaRowState): boolean {
  return [
    row.cardsTopSpeed, row.cardsAccel, row.cardsHandling, row.cardsNitro,
    row.deltaTopSpeed, row.deltaAccel, row.deltaHandling, row.deltaNitro,
  ].some((v) => v.trim() !== '');
}

export function initDeltasState(rows = 3): DeltasState {
  return ['oneStar','twoStar','threeStar','fourStar','fiveStar','sixStar'].map(() =>
    Array(rows).fill(null).map((_, i) => emptyDeltaRow(i + 1))
  );
}