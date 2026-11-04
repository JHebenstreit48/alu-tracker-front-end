import { useSearchParams } from 'react-router-dom';
import CarComparison from '@/components/CarLab/CarComparison';
import UpgradeSimulator from '@/components/CarLab/UpgradeSimulator';

const TABS = [
  { id: 'compare', label: 'Compare' },
  { id: 'simulator', label: 'Upgrade Simulator' },
] as const;

type TabId = (typeof TABS)[number]['id'];

export default function CarLabTabs() {
  const [params, setParams] = useSearchParams();
  const active: TabId = params.get('tab') === 'simulator' ? 'simulator' : 'compare';

  const select = (id: TabId) => {
    const next = new URLSearchParams(params);
    next.set('tab', id);
    setParams(next, { replace: true });
  };

  return (
    <section className="carLabTabs">
      <div className="carLabTabList" role="tablist" aria-label="Car Lab tools">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            id={`carLabTab-${tab.id}`}
            aria-selected={active === tab.id}
            aria-controls="carLabPanel"
            className={`carLabTab ${active === tab.id ? 'is-active' : ''}`}
            onClick={() => select(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div id="carLabPanel" role="tabpanel" aria-labelledby={`carLabTab-${active}`}>
        {active === 'compare' ? <CarComparison /> : <UpgradeSimulator />}
      </div>
    </section>
  );
}