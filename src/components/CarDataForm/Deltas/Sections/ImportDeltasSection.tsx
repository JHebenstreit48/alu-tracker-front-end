import DeltaRowFields from '@/components/CarDataForm/Deltas/DeltaRowFields';
import { STAR_KEYS, STAR_LABELS } from '@/types/CarDataSubmission/tabs/shared';
import type { CarSeedFields } from '@/hooks/CarDataSubmission/useCarSeedFields/useCarSeedFields';
import type { DeltaRowState, ImportDeltaRowState } from '@/types/CarDataSubmission/tabs/deltas';

type Props = {
  fields: CarSeedFields;
};

function blockHasData(block: Record<string, any>): boolean {
  return Object.values(block).some((v) => typeof v === 'number' && v > 0);
}

function importReadOnly(seedEntry: any, correcting: boolean) {
  if (!seedEntry || correcting) return { cards: false, deltas: false };
  return {
    cards:  blockHasData(seedEntry.cardsAppliedByStat ?? {}),
    deltas: blockHasData(seedEntry.statDeltaByStat ?? {}),
  };
}

export default function ImportDeltasSection({ fields }: Props) {
  const {
    activeKey,
    activeStars,
    getImportDeltas,
    updateImportDelta,
    seedImportDeltasByStar,
    isCorrectionMode,
  } = fields;

  const correcting = isCorrectionMode(activeKey, 'deltas');

  return (
    <div className="DeltaSection">
      <h3 className="DeltaSection__title">Import Deltas</h3>
      {getImportDeltas(activeKey).slice(0, activeStars).map((rows, starIdx) => {
        const starKey = STAR_KEYS[starIdx];
        const seedRows: any[] = seedImportDeltasByStar?.[starKey] ?? [];
        const importRows = rows as ImportDeltaRowState[];

        const stageMap = new Map<number, { row: ImportDeltaRowState; idx: number }[]>();
        importRows.forEach((row, idx) => {
          const existing = stageMap.get(row.stage) ?? [];
          stageMap.set(row.stage, [...existing, { row, idx }]);
        });

        return (
          <div key={starIdx} className="DeltaStarGroup">
            <h4 className="DeltaStarGroup__title">{STAR_LABELS[starIdx]}</h4>
            {Array.from(stageMap.entries()).map(([stageNum, entries]) =>
              entries.map(({ row, idx }) => {
                const seedEntry = seedRows[idx] ?? null;
                const ro = importReadOnly(seedEntry, correcting);
                return (
                  <DeltaRowFields
                    key={idx}
                    row={row as unknown as DeltaRowState}
                    onChange={(field, v) => updateImportDelta(starIdx, idx, field as keyof ImportDeltaRowState, v)}
                    stageLabel={`Stage ${stageNum}`}
                    rarity={row.rarity}
                    readOnlyCards={ro.cards}
                    readOnlyDeltas={ro.deltas}
                  />
                );
              })
            )}
          </div>
        );
      })}
    </div>
  );
}