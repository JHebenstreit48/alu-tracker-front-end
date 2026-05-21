import EmptyState from '@/components/CarDataForm/Stats/shared/EmptyState';
import DeltaRowFields from '@/components/CarDataForm/Stats/shared/DeltaRowFields';
import type { CarSeedFields } from '@/hooks/CarDataSubmission/useCarSeedFields/useCarSeedFields';
import { STAR_KEYS, STAR_LABELS } from '@/types/CarDataSubmission/tabs/shared';
import type { DeltaRowState, ImportDeltaRowState } from '@/types/CarDataSubmission/tabs/deltas';

type Props = {
  fields: CarSeedFields;
  noCarsSelected: boolean;
  carSelector: React.ReactNode;
  perCarNote: React.ReactNode;
};

export default function Deltas({ fields, noCarsSelected, carSelector, perCarNote }: Props) {
  if (noCarsSelected) return <EmptyState message="Select a car to enter delta data." />;

  const {
    activeKey, activeStars,
    getStageDeltas, getImportDeltas,
    updateStageDelta, updateImportDelta,
    seedStageDeltasByStar,
    seedImportDeltasByStar,
    isCorrectionMode, toggleCorrectionMode,
  } = fields;

  const correcting = isCorrectionMode(activeKey, 'deltas');

  function blockHasData(block: Record<string, any>): boolean {
    return Object.values(block).some((v) => typeof v === 'number' && v > 0);
  }

  function stageReadOnly(seedEntry: any) {
    if (!seedEntry || correcting) return { cards: false, deltas: false };
    return {
      cards:  blockHasData(seedEntry.rankByStat ?? {}),
      deltas: blockHasData(seedEntry.statByStat ?? {}),
    };
  }

  function importReadOnly(seedEntry: any) {
    if (!seedEntry || correcting) return { cards: false, deltas: false };
    return {
      cards:  blockHasData(seedEntry.cardsAppliedByStat ?? {}),
      deltas: blockHasData(seedEntry.statDeltaByStat ?? {}),
    };
  }

  return (
    <>
      {carSelector}{perCarNote}
      <div className="StatsTabHeader">
        <label className="CorrectionToggle">
          <input type="checkbox" checked={correcting} onChange={() => toggleCorrectionMode('deltas')} />
          <span>Submit correction</span>
        </label>
      </div>
      <div className="DeltasPanel">

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
                  const ro = stageReadOnly(seedEntry);
                  return (
                    <DeltaRowFields
                      key={rowIdx}
                      row={row}
                      onChange={(field, v) => updateStageDelta(starIdx, rowIdx, field, v)}
                      readOnlyCards={ro.cards}
                      readOnlyDeltas={ro.deltas}
                    />
                  );
                })}
              </div>
            );
          })}
        </div>

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
                    const ro = importReadOnly(seedEntry);
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

      </div>
    </>
  );
}