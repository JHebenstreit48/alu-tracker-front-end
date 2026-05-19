import EmptyState from '@/components/CarDataForm/Stats/shared/EmptyState';
import RarityBadge from '@/components/CarDataForm/Stats/shared/RarityBadge';
import Field from '@/components/CarDataForm/Stats/shared/Field';
import type { CarSeedFields } from '@/hooks/CarDataSubmission/useCarSeedFields/useCarSeedFields';
import { IMPORT_RARITIES, type ImportRarity } from '@/types/CarDataSubmission/tabs/imports';

type Props = {
  fields: CarSeedFields;
  noCarsSelected: boolean;
  carSelector: React.ReactNode;
  perCarNote: React.ReactNode;
};

export default function Imports({ fields, noCarsSelected, carSelector, perCarNote }: Props) {
  if (noCarsSelected) return <EmptyState message="Select a car to enter import data." />;

  const {
    activeKey, seedLoading,
    importStageNums,
    getImportCosts, getImportXp, getImportReqs,
    updateImportCost, updateImportXp, updateImportReq,
    seedImportCosts, seedImportXp, seedImportReqs,
    isCorrectionMode, toggleCorrectionMode,
  } = fields;

  const correcting = isCorrectionMode(activeKey, 'imports');
  const costs  = getImportCosts(activeKey);
  const xp     = getImportXp(activeKey);
  const reqs   = getImportReqs(activeKey);

  if (!importStageNums.length && !seedLoading) {
    return <EmptyState message="No import data found for this car yet." />;
  }

  return (
    <>
      {carSelector}{perCarNote}
      <div className="StatsTabHeader">
        {seedLoading && <p className="CarDataFormHint">Loading import data…</p>}
        <label className="CorrectionToggle">
          <input type="checkbox" checked={correcting} onChange={() => toggleCorrectionMode('imports')} />
          <span>Submit correction</span>
        </label>
      </div>

      {importStageNums.map((stageNum) => {
        const seedReqStage = seedImportReqs?.[stageNum];
        const seedCostStage = seedImportCosts?.[stageNum];
        const seedXpStage = seedImportXp?.[stageNum];

        return (
          <div key={stageNum} className="ImportStageGroup">
            <h3 className="ImportStageGroup__title">Stage {stageNum}</h3>

            {IMPORT_RARITIES.map((rarity) => {
              const seedReq = seedReqStage?.[rarity];
              if (!seedReq) return null;

              const reqEntry = (reqs[stageNum] as any)?.[rarity] ?? {};
              const seedCost = (seedCostStage as any)?.[rarity];
              const seedXpVal = (seedXpStage as any)?.[rarity];
              const costVal = (costs[stageNum] as any)?.[rarity] ?? '';
              const xpVal   = (xp[stageNum] as any)?.[rarity] ?? '';

              const hasRealCost = seedCost !== undefined && seedCost !== 0;
              const hasRealXp   = seedXpVal !== undefined && seedXpVal !== 0;

              return (
                <div key={rarity} className="ImportRarityGroup">
                  <div className="ImportRarityGroup__header">
                    <RarityBadge rarity={rarity as ImportRarity} />
                  </div>

                  <div className="ImportRarityGroup__fields">
                    <div className="ImportRarityGroup__section">
                      <div className="ImportRarityGroup__sectionTitle">Requirements (cards per stat)</div>
                      <div className="StatsGrid">
                        {['topSpeed','acceleration','handling','nitro'].map((stat) => {
                          const seedReqVal = (seedReq as any)[stat];
                          const hasReq = seedReqVal !== undefined && seedReqVal !== 0;
                          return (
                            <Field
                              key={stat}
                              label={stat.replace('topSpeed','Top Speed').replace('acceleration','Acceleration').replace('handling','Handling')}
                              v={(reqEntry as any)[stat] ?? ''}
                              s={(v) => updateImportReq(stageNum, rarity, stat, v)}
                              readOnly={!correcting && hasReq}
                              placeholder={hasReq ? String(seedReqVal) : '—'}
                            />
                          );
                        })}
                      </div>
                    </div>

                    <div className="ImportRarityGroup__section">
                      <div className="ImportRarityGroup__sectionTitle">Credit cost & Garage XP</div>
                      <div className="StatsGrid">
                        <Field
                          label="Credit cost"
                          v={costVal}
                          s={(v) => updateImportCost(stageNum, rarity, v)}
                          readOnly={!correcting && hasRealCost}
                          placeholder={hasRealCost ? String(seedCost) : '—'}
                        />
                        <Field
                          label="Garage XP"
                          v={xpVal}
                          s={(v) => updateImportXp(stageNum, rarity, v)}
                          readOnly={!correcting && hasRealXp}
                          placeholder={hasRealXp ? String(seedXpVal) : '—'}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        );
      })}
    </>
  );
}