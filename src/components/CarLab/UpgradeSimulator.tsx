import SimControls from '@/components/CarLab/simulator/controls/simControls';
import StatChartGrid from '@/components/CarLab/simulator/charts/statChartGrid';
import SimNotice from '@/components/CarLab/simulator/notice/simNotice';
import { useSimulation } from '@/hooks/carLab/useSimulation';
import { useSimulatorState } from '@/hooks/carLab/useSimulatorState';

export default function UpgradeSimulator() {
  const ui = useSimulatorState();
  const sim = useSimulation(ui.slug, ui.step, ui.onlyLogged);
  const { state } = sim;

  let body = <p className="carLabPanel carLabEmpty">Pick a car to start.</p>;
  if (ui.slug && sim.loading) {
    body = <p className="carLabPanel carLabEmpty">Loading car data…</p>;
  } else if (ui.slug && sim.error) {
    body = <p className="carLabPanel carLabEmpty">{sim.error}</p>;
  } else if (state && state.exactCount < 2) {
    body = (
      <p className="carLabPanel carLabEmpty">
        This car has fewer than two logged steps, so there is nothing to draw yet.
      </p>
    );
  } else if (state && sim.selectedIndex >= 0) {
    body = <StatChartGrid state={state} selected={sim.selectedIndex} />;
  }

  return (
    <div className="carLabSimulator">
      <div className="carLabSimControls">
        <SimControls
          items={sim.items}
          slug={ui.slug}
          car={sim.car}
          loading={sim.loading}
          error={sim.error}
          steps={sim.steps}
          index={sim.index}
          onlyLogged={ui.onlyLogged}
          onSlug={ui.setSlug}
          onStep={ui.setStep}
          onOnlyLogged={ui.setOnlyLogged}
        />
      </div>
      <div className="carLabCompareStage">
        <SimNotice />
        {sim.listError && <p className="carLabPanel carLabEmpty">{sim.listError}</p>}
        {body}
      </div>
    </div>
  );
}