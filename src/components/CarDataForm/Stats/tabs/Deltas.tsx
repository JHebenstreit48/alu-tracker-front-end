import EmptyState from '@/components/CarDataForm/Stats/shared/EmptyState';
import DeltaRowFields from '@/components/CarDataForm/Stats/shared/DeltaRowFields';
import type { CarSeedFields } from '@/hooks/CarDataSubmission/useCarSeedFields/useCarSeedFields';
import { STAR_LABELS } from '@/types/CarDataSubmission/tabs/shared';
import type { ImportDeltaRowState } from '@/types/CarDataSubmission/tabs/deltas';

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
                  readOnly={false}
                />
              ))}
            </div>
          ))}
        </div>
        <div className="DeltaSection">
          <h3 className="DeltaSection__title">Import Deltas</h3>
          {getImportDeltas(activeKey).slice(0, activeStars).map((rows, starIdx) => (
            <div key={starIdx} className="DeltaStarGroup">
              <h4 className="DeltaStarGroup__title">{STAR_LABELS[starIdx]}</h4>
              {rows.map((row, rowIdx) => (
                <DeltaRowFields
                  key={rowIdx}
                  row={row as any}
                  onChange={(field, v) => updateImportDelta(starIdx, rowIdx, field as keyof ImportDeltaRowState, v)}
                  readOnly={false}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}