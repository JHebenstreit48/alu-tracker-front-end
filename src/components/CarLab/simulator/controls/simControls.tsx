import type { CarLabCar, CarLabListItem } from '@/types/CarLab/carLab';
import type { SimStep } from '@/types/CarLab/simulator';
import CarPicker from '@/components/CarLab/compare/cars/carPicker';
import CoverageList from '@/components/CarLab/compare/cars/coverageList';
import SimToggle from '@/components/CarLab/simulator/controls/simToggle';
import StepSlider from '@/components/CarLab/simulator/controls/stepSlider';

interface Props {
  items: CarLabListItem[];
  slug: string | null;
  car: CarLabCar | null;
  loading: boolean;
  error: string | null;
  steps: SimStep[];
  index: number;
  onlyLogged: boolean;
  onSlug: (slug: string | null) => void;
  onStep: (id: string) => void;
  onOnlyLogged: (on: boolean) => void;
}

export default function SimControls(props: Props) {
  const { items, slug, car, loading, error, steps, index } = props;
  return (
    <section className="carLabPanel">
      <CarPicker label="Car" items={items} value={slug} exclude={null} onChange={props.onSlug} />
      {slug && <CoverageList car={car} loading={loading} error={error} />}
      {steps.length > 0 && (
        <>
          <StepSlider steps={steps} index={index} onChange={props.onStep} />
          <SimToggle checked={props.onlyLogged} onChange={props.onOnlyLogged} />
        </>
      )}
    </section>
  );
}