import type { FullCar } from '@/types/shared/car';

export function makeSeedSelectors(seedData: FullCar | null) {
  const sd = seedData as any;

  return {
    seedStock:         sd?.stock          ?? null,
    seedGold:          sd?.gold           ?? null,
    seedMaxStar:       sd?.maxStar        ?? null,
    seedStagesByStar:  sd?.stages         ?? null,
    seedCreditCosts:   sd?.creditCosts?.perUpgradeByStage    ?? null,
    seedGarageLevelXp: sd?.garageLevelXp?.perUpgradeByStage  ?? null,
    seedImportCosts:   sd?.imports?.costs?.perCardByStage     ?? null,
    seedImportXp:      sd?.imports?.garageLevelXp?.perCardByStage ?? null,
    seedImportReqs:    sd?.imports?.requirements?.incrementalByStage ?? null,
  };
}