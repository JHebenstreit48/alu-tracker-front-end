import { useMemo } from 'react';
import CarSlotPanel from '@/components/CarLab/compare/cars/carSlotPanel';
import ChartControls from '@/components/CarLab/compare/chart/chartControls';
import CompareChart from '@/components/CarLab/compare/chart/compareChart';
import DataNotice from '@/components/CarLab/compare/notice/dataNotice';
import CompareSummary from '@/components/CarLab/compare/results/compareSummary';
import PointSelect from '@/components/CarLab/compare/results/pointSelect';
import ResultsTable from '@/components/CarLab/compare/results/resultsTable';
import { useComparePair } from '@/hooks/carLab/useComparePair';
import { useCompareState } from '@/hooks/carLab/useCompareState';
import { compareStats } from '@/utils/carLab/compareRows';
import { findPoint } from '@/utils/carLab/points';
import { buildVerdict } from '@/utils/carLab/verdict';

export default function CarComparison() {
  const state = useCompareState();
  const pair = useComparePair(state.a, state.b, state.point);
  const { carA, carB, active, pointsA, pointsB } = pair;
  const a = carA.car;
  const b = carB.car;

  const canGain = Boolean(a?.stock && b?.stock);
  const canPct = canGain && Boolean(a?.gold && b?.gold);
  const blocked = (state.scale === 'gain' && !canGain) || (state.scale === 'pct' && !canPct);
  const scale = blocked ? 'abs' : state.scale;

  const verdict = useMemo(
    () => (a && b ? buildVerdict(a, b, pointsA, pointsB) : null),
    [a, b, pointsA, pointsB]
  );
  const pa = active ? findPoint(pointsA, active.id) : undefined;
  const pb = active ? findPoint(pointsB, active.id) : undefined;

  let hint: string | null = null;
  if (!state.a || !state.b) hint = 'Pick two cars to start comparing.';
  else if (carA.loading || carB.loading) hint = 'Loading car data…';

  return (
    <div className="carLabCompare">
      <div className="carLabCompareCars">
        <CarSlotPanel
          slot="a"
          items={pair.items}
          value={state.a}
          exclude={state.b}
          item={pair.itemA}
          car={a}
          loading={carA.loading}
          error={carA.error}
          onChange={(slug) => state.setCar('a', slug)}
        />
        <CarSlotPanel
          slot="b"
          items={pair.items}
          value={state.b}
          exclude={state.a}
          item={pair.itemB}
          car={b}
          loading={carB.loading}
          error={carB.error}
          onChange={(slug) => state.setCar('b', slug)}
        />
      </div>
      <div className="carLabCompareStage">
        <DataNotice carCount={pair.items.length} />
        {pair.listError && <p className="carLabPanel carLabEmpty">{pair.listError}</p>}
        {hint && <p className="carLabPanel carLabEmpty">{hint}</p>}
        {a && b && verdict && (
          <>
            <section className="carLabPanel">
              {pa && pb ? (
                <>
                  <PointSelect points={pair.shared} value={active?.id} onChange={state.setPoint} />
                  <ResultsTable
                    nameA={a.name}
                    nameB={b.name}
                    pointLabel={pa.label}
                    rows={compareStats(pa, pb)}
                  />
                </>
              ) : (
                <p className="carLabEmpty">
                  These two cars have no data point in common yet, so there is nothing to compare
                  side by side.
                </p>
              )}
              <CompareSummary verdict={verdict} />
            </section>
            <section className="carLabPanel">
              <ChartControls
                stat={state.stat}
                scale={scale}
                view={state.view}
                canGain={canGain}
                canPct={canPct}
                onStat={state.setStat}
                onScale={state.setScale}
                onView={state.setView}
              />
              <CompareChart a={a} b={b} stat={state.stat} scale={scale} view={state.view} />
            </section>
          </>
        )}
      </div>
    </div>
  );
}