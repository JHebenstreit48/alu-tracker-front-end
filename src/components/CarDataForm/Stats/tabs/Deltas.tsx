import EmptyState from '@/components/CarDataForm/Stats/shared/EmptyState';
import DeltaRowFields from '@/components/CarDataForm/Stats/shared/DeltaRowFields';
import type { CarSeedFields } from '@/hooks/CarDataSubmission/useCarSeedFields/useCarSeedFields';
import { STAR_LABELS } from '@/types/CarDataSubmission/tabs/shared';
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
    isCorrectionMode, toggleCorrectionMode,
  } = fields;

  const correcting = isCorrectionMode(activeKey, 'deltas');

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
          {getStageDeltas(activeKey).slice(0, activeStars).map((rows, starIdx) => (
            <div key={starIdx} className="DeltaStarGroup">
              <h4 className="DeltaStarGroup__title">{STAR_LABELS[starIdx]}</h4>
              {rows.map((row, rowIdx) => (
                <DeltaRowFields
                  key={rowIdx}
                  row={row}
                  onChange={(field, v) => updateStageDelta(starIdx, rowIdx, field, v)}
                />
              ))}
            </div>
          ))}
        </div>

        <div className="DeltaSection">
          <h3 className="DeltaSection__title">Import Deltas</h3>
          {getImportDeltas(activeKey).slice(0, activeStars).map((rows, starIdx) => {
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
                  entries.map(({ row, idx }) => (
                    <DeltaRowFields
                      key={idx}
                      row={row as unknown as DeltaRowState}
                      onChange={(field, v) => updateImportDelta(starIdx, idx, field as keyof ImportDeltaRowState, v)}
                      stageLabel={`Stage ${stageNum}`}
                      rarity={row.rarity}
                    />
                  ))
                )}
              </div>
            );
          })}
        </div>

      </div>
    </>
  );
}