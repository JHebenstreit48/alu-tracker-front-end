import { useState } from 'react';
import type { Car } from '@/types/shared/car';
import type { CarStatsPatch } from '@/types/CarDataSubmission/carSubmission';
import { useCarSeedFields } from '@/hooks/CarDataSubmission/useCarSeedFields/useCarSeedFields';
import { carLabel } from '@/types/CarDataSubmission/tabs/shared';
import CarChipSelector from '@/components/CarDataForm/Stats/shared/CarChipSelector';

import Overview      from '@/components/CarDataForm/Stats/tabs/Overview';
import MaxStars      from '@/components/CarDataForm/Stats/tabs/MaxStars';
import Stages        from '@/components/CarDataForm/Stats/tabs/Stages';
import Deltas        from '@/components/CarDataForm/Stats/tabs/Deltas';
import Imports       from '@/components/CarDataForm/Stats/tabs/Imports';
import UpgradeCosts  from '@/components/CarDataForm/Stats/tabs/UpgradeCosts';
import GarageLevelXp from '@/components/CarDataForm/Stats/tabs/GarageLevelXp';

type Props = {
  selectedKeys: string[];
  selectedCars: Car[];
  onApplyStats: (stats: CarStatsPatch) => void;
  onToggleKey: (key: string) => void;
};

type TabId = 'overview' | 'maxStars' | 'stages' | 'deltas' | 'imports' | 'cost' | 'xp';

const TABS: { id: TabId; label: string }[] = [
  { id: 'overview', label: 'Blueprints · Stock · Gold' },
  { id: 'maxStars', label: 'Max ★ Stats' },
  { id: 'stages',   label: 'Stages' },
  { id: 'deltas',   label: 'Deltas' },
  { id: 'imports',  label: 'Imports' },
  { id: 'cost',     label: 'Upgrade Cost' },
  { id: 'xp',       label: 'Garage Level XP' },
];

export default function StatsFields({
  selectedKeys, selectedCars, onApplyStats, onToggleKey,
}: Props): JSX.Element {
  const [activeTab,    setActiveTab]    = useState<TabId>('overview');
  const [applied,      setApplied]      = useState(false);
  const [activeCarIdx, setActiveCarIdx] = useState(0);

  const fields = useCarSeedFields(selectedCars, activeCarIdx);
  const { activeCar, anyValue, buildStatsPatch } = fields;

  const disabled       = selectedKeys.length === 0;
  const noCarsSelected = selectedCars.length === 0;

  const apply = () => {
    if (disabled || !anyValue) return;
    selectedCars.forEach((car) => onApplyStats(buildStatsPatch(car)));
    setApplied(true);
    setTimeout(() => setApplied(false), 3000);
  };

  const handleRemove = (key: string) => {
    onToggleKey(key);
    // If removing the active car, move to previous
    const removedIdx = selectedCars.findIndex(
      (c) => (c.normalizedKey ?? String(c.id)) === key
    );
    if (removedIdx <= activeCarIdx && activeCarIdx > 0) {
      setActiveCarIdx((p) => p - 1);
    }
  };

  const carSelector = (
    <CarChipSelector
      selectedCars={selectedCars}
      activeIdx={activeCarIdx}
      onSelect={setActiveCarIdx}
      onRemove={handleRemove}
    />
  );

  const perCarNote = selectedCars.length > 1 ? (
    <p className="CarDataFormHint" style={{ marginBottom: '0.5rem' }}>
      Showing: <strong style={{ color: '#e8b84b' }}>
        {activeCar ? carLabel(activeCar) : '—'}
      </strong>
    </p>
  ) : null;

  const tabProps = { fields, noCarsSelected, carSelector, perCarNote };

  return (
    <div className="StatsFields">
      <p className="CarDataFormHint">
        Simple number inputs. Leave blank to skip changing that stat.
        {selectedCars.length === 1 && (
          <span> Showing stats for a {selectedCars[0].stars}★ car.</span>
        )}
      </p>
      <p className="CarDataFormHint">
        <span style={{ color: '#ffc400' }}>★ Top Speed must be entered in KPH.</span>
      </p>

      <div className="StatsTabs">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`StatsTab${activeTab === tab.id ? ' StatsTab--active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && <Overview      {...tabProps} />}
      {activeTab === 'maxStars' && <MaxStars      {...tabProps} />}
      {activeTab === 'stages'   && <Stages        {...tabProps} />}
      {activeTab === 'deltas'   && <Deltas        {...tabProps} />}
      {activeTab === 'imports'  && <Imports       {...tabProps} />}
      {activeTab === 'cost'     && <UpgradeCosts  {...tabProps} />}
      {activeTab === 'xp'       && <GarageLevelXp {...tabProps} />}

      {applied && (
        <p className="CarDataFormMsg CarDataFormMsg--ok">
          ✓ Stats staged — click Submit Changes when ready.
        </p>
      )}

      <div className="CarDataFormRow">
        <button type="button" onClick={apply} disabled={disabled || !anyValue}>
          Apply stats to selected
        </button>
      </div>
    </div>
  );
}