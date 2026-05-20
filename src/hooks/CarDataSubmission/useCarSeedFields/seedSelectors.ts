import type { FullCar } from '@/types/shared/car';

export function makeSeedSelectors(seedData: FullCar | null) {
  const sd = seedData as any;

  const seedBlueprints = sd ? {
    oneStar:   sd.blueprints1Star,
    twoStar:   sd.blueprints2Star,
    threeStar: sd.blueprints3Star,
    fourStar:  sd.blueprints4Star,
    fiveStar:  sd.blueprints5Star,
    sixStar:   sd.blueprints6Star,
  } : null;

  const goldObj = sd?.gold?.gold ?? sd?.gold ?? null;
  const seedGold = goldObj ? {
    rank:         goldObj.rank,
    topSpeed:     goldObj.topSpeed,
    acceleration: goldObj.acceleration,
    handling:     goldObj.handling,
    nitro:        goldObj.nitro,
  } : null;

  const stockObj = sd?.stock?.stock ?? sd?.stock ?? null;
  const seedStock = stockObj ? {
    rank:         stockObj.rank,
    topSpeed:     stockObj.topSpeed,
    acceleration: stockObj.acceleration,
    handling:     stockObj.handling,
    nitro:        stockObj.nitro,
  } : null;

  return {
    seedBlueprints,
    seedStock,
    seedGold,
    seedMaxStar:            sd?.maxStar                                          ?? null,
    seedStagesByStar:       sd?.stages                                           ?? null,
    seedCreditCosts:        sd?.creditCosts?.perUpgradeByStage                   ?? null,
    seedGarageLevelXp:      sd?.garageLevelXp?.perUpgradeByStage                 ?? null,
    seedImportCosts:        sd?.imports?.costs?.perCardByStage                   ?? null,
    seedImportXp:           sd?.imports?.garageLevelXp?.perCardByStage           ?? null,
    seedImportReqs:         sd?.imports?.requirements?.incrementalByStage        ?? null,
    seedImportDeltasByStar: sd?.importDeltas                                     ?? null,
    seedStageDeltasByStar:  sd?.stagesDeltas                                     ?? null,
  };
}