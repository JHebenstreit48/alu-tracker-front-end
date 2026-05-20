export type ImportRarity = 'uncommon' | 'rare' | 'epic';

export const IMPORT_RARITIES: ImportRarity[] = ['uncommon', 'rare', 'epic'];

export const RARITY_COLORS: Record<ImportRarity, string> = {
  uncommon: '#4a9eff',
  rare:     '#9d5cf0',
  epic:     '#ffc400',
};

export const RARITY_BG: Record<ImportRarity, string> = {
  uncommon: 'rgba(74, 158, 255, 0.12)',
  rare:     'rgba(157, 92, 240, 0.12)',
  epic:     'rgba(255, 196, 0, 0.12)',
};

export type ImportRequirementEntry = {
  topSpeed: number;
  acceleration: number;
  handling: number;
  nitro: number;
};

export type ImportRequirements = {
  incrementalByStage: Record<string, {
    uncommon: ImportRequirementEntry;
    rare: ImportRequirementEntry;
    epic: ImportRequirementEntry;
  }>;
};

export type ImportCosts = {
  perCardByStage: Record<string, Partial<Record<ImportRarity, number>>>;
};

export type ImportGarageLevelXp = {
  perCardByStage: Record<string, Partial<Record<ImportRarity, number>>>;
};

export type ImportFieldState = {
  stage: number;
  rarity: ImportRarity;
  topSpeed: string;
  acceleration: string;
  handling: string;
  nitro: string;
};

export function emptyImportField(stage: number, rarity: ImportRarity): ImportFieldState {
  return { stage, rarity, topSpeed: '', acceleration: '', handling: '', nitro: '' };
}