import type { StatBlockState } from '@/types/CarDataSubmission/tabs/shared';
import type { DeltasState, ImportDeltasState } from '@/types/CarDataSubmission/tabs/deltas';
import type { StageStatInputState } from '@/types/CarDataSubmission/tabs/stages';

export type BpsMap          = Record<string, string[]>;
export type StatBlockMap     = Record<string, StatBlockState>;
export type StatBlockArrMap  = Record<string, StatBlockState[]>;
export type StageInputMap    = Record<string, Record<string, StageStatInputState>>;
export type StringKeyMap     = Record<string, Record<string, string>>;
export type NestedStringMap  = Record<string, Record<string, Record<string, string>>>;
export type DeepStringMap    = Record<string, Record<string, Record<string, Record<string, string>>>>;
export type DeltasMap        = Record<string, DeltasState>;
export type ImportDeltasMap  = Record<string, ImportDeltasState>;
export type CorrectionMap    = Record<string, Record<string, boolean>>;