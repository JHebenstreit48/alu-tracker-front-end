export interface GarageLevelStats {
  loading: boolean;
  error?: string;
  currentLevel: number;
  currentXp: number;
  nextLevel: number | null;
  xpToNext: number;
  xpWithinLevelPercent: number; // 0–100, progress inside current level
  levelPercent: number;         // 0–100, currentLevel / maxLevel
  overallPercent: number;       // 0–100, overall progress toward max
}