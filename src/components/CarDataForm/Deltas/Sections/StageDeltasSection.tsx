import DeltaRowFields from '@/components/CarDataForm/Deltas/DeltaRowFields';
import { STAR_KEYS, STAR_LABELS } from '@/types/CarDataSubmission/tabs/shared';
import type { CarSeedFields } from '@/hooks/CarDataSubmission/useCarSeedFields/useCarSeedFields';

type Props = {
  fields: CarSeedFields;
};

function blockHasData(block: Record<string, any>): boolean {
  return Object.values(block).some((v) => typeof v === 'number' && v > 0);
}

function stageReadOnly(seedEntry: any, correcting: boolean) {
  if (!seedEntry || correcting) return { cards: false, deltas: false };
  return {
    cards:  blockHasData(seedEntry.rankByStat ?? {}),
    deltas: blockHasData(seedEntry.statByStat ?? {}),
  };
}

function stageDeltaLabel(stage: number): string {
  return stage === 1 ? 'Stock → Stage 1' : `Stage ${stage - 1} → Stage ${stage}`;
}

export default function StageDeltasSection({ fields }: Props) {
  const {
    activeKey,
    activeStars,
    getStageDeltas,
    updateStageDelta,
    seedStageDeltasByStar,
    isCorrectionMode,
  } = fields;

  const correcting = isCorrectionMode(activeKey, 'deltas');

  return (
    <div className="DeltaSection">
      <h3 className="DeltaSection__title">Stage Deltas</h3>
      {getStageDeltas(activeKey).slice(0, activeStars).map((rows, starIdx) => {
        const starKey = STAR_KEYS[starIdx];
        const seedRows: any[] = seedStageDeltasByStar?.[starKey] ?? [];
        return (
          <div key={starIdx} className="DeltaStarGroup">
            <h4 className="DeltaStarGroup__title">{STAR_LABELS[starIdx]}</h4>
            {rows.map((row, rowIdx) => {
              const seedEntry = seedRows[rowIdx] ?? null;
              const ro = stageReadOnly(seedEntry, correcting);
              return (
                <DeltaRowFields
                  key={rowIdx}
                  row={row}
                  onChange={(field, v) => updateStageDelta(starIdx, rowIdx, field, v)}
                  readOnlyCards={ro.cards}
                  readOnlyDeltas={ro.deltas}
                  stageLabel={stageDeltaLabel(row.stage)}
                  cardsLabel="Rank Increase per Stat"
                />
              );
            })}
          </div>
        );
      })}
    </div>
  );
}