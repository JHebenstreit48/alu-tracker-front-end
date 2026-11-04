import type { CarLabCar, CarLabListItem } from '@/types/CarLab/carLab';
import type { Slot } from '@/types/CarLab/compare';
import CarHeader from '@/components/CarLab/compare/cars/carHeader';
import CarPicker from '@/components/CarLab/compare/cars/carPicker';
import CoverageList from '@/components/CarLab/compare/cars/coverageList';

interface Props {
  slot: Slot;
  items: CarLabListItem[];
  value: string | null;
  exclude: string | null;
  item?: CarLabListItem;
  car: CarLabCar | null;
  loading: boolean;
  error: string | null;
  onChange: (slug: string | null) => void;
}

export default function CarSlotPanel({
  slot,
  items,
  value,
  exclude,
  item,
  car,
  loading,
  error,
  onChange,
}: Props) {
  return (
    <section className="carLabPanel">
      <CarPicker slot={slot} items={items} value={value} exclude={exclude} onChange={onChange} />
      {item ? (
        <>
          <CarHeader slot={slot} item={item} />
          <CoverageList car={car} loading={loading} error={error} />
        </>
      ) : (
        <p className="carLabEmpty">Choose a car to see what data is logged for it.</p>
      )}
    </section>
  );
}