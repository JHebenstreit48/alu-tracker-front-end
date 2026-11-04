export type StatKey = 'rank' | 'topSpeed' | 'acceleration' | 'handling' | 'nitro';

export type StatSet = Record<StatKey, number>;

export type ScaleMode = 'abs' | 'gain' | 'pct';

export type PointKind = 'stock' | 'stage' | 'star' | 'gold';

export interface CarLabPoint {
  id: string;
  kind: PointKind;
  x: number;
  order: number;
  label: string;
  stats: StatSet;
}

export interface CarLabListItem {
  slug: string;
  name: string;
  carClass: string;
  rarity: string;
  maxStars: number;
  keyCar?: boolean;
  image?: string;
}

export interface CarLabCar extends CarLabListItem {
  stock?: StatSet;
  stages: Record<number, StatSet>;
  checkpoints: Record<number, StatSet>;
  gold?: StatSet;
}