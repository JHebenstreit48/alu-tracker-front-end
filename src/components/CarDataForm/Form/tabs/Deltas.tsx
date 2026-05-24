import EmptyState from '@/components/CarDataForm/Stats/shared/EmptyState';
import type { CarSeedFields } from '@/hooks/CarDataSubmission/useCarSeedFields/useCarSeedFields';
import { StageDeltasSection, ImportDeltasSection } from '@/components/CarDataForm/Deltas/Sections';

type Props = {
  fields: CarSeedFields;
  noCarsSelected: boolean;
  carSelector: React.ReactNode;
  perCarNote: React.ReactNode;
};

export default function Deltas({ fields, noCarsSelected, carSelector, perCarNote }: Props) {
  if (noCarsSelected) return <EmptyState message="Select a car to enter delta data." />;

  const { activeKey, isCorrectionMode, toggleCorrectionMode } = fields;
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
        <StageDeltasSection fields={fields} />
        <ImportDeltasSection fields={fields} />
      </div>
    </>
  );
}