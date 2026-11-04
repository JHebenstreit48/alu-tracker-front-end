import { useMemo } from 'react';
import { useCarAPI } from '@/hooks/Cars';
import { useViewCounts } from '@/hooks/Tracking/useViewCounts';
import { generateCarKey } from '@/utils/shared/StorageUtils';
import type { ViewedBrand, ViewedCar } from '@/types/Tracking/viewedItems';
import MostViewedCars from '@/components/Tracking/Cars/favoritesAndViews/mostViewedCars';
import MostViewedBrands from '@/components/Tracking/Cars/favoritesAndViews/mostViewedBrands';

const TOP_N = 10;

export default function Views() {
  const { cars, loading: carsLoading } = useCarAPI('All Classes');
  const { carViews, loading: viewsLoading } = useViewCounts();

  const viewedCars = useMemo<ViewedCar[]>(
    () =>
      cars
        .map((car) => {
          const carKey = generateCarKey(car.brand, car.model);
          return { car, carKey, views: carViews[carKey] ?? 0 };
        })
        .filter((item) => item.views > 0)
        .sort(
          (a, b) =>
            b.views - a.views ||
            `${a.car.brand} ${a.car.model}`.localeCompare(`${b.car.brand} ${b.car.model}`)
        ),
    [cars, carViews]
  );

  const viewedBrands = useMemo<ViewedBrand[]>(() => {
    const totals = new Map<string, number>();
    for (const { car, views } of viewedCars) {
      totals.set(car.brand, (totals.get(car.brand) ?? 0) + views);
    }
    return Array.from(totals, ([brand, views]) => ({ brand, views })).sort(
      (a, b) => b.views - a.views || a.brand.localeCompare(b.brand)
    );
  }, [viewedCars]);

  const loading = carsLoading || viewsLoading;

  return (
    <section className="viewsSection">
      <hr className="sectionRule" />
      <h2 className="carCollectionTitle">Most Viewed</h2>
      <hr className="sectionRule" />

      {loading ? (
        <p className="viewsPlaceholder">Loading views…</p>
      ) : viewedCars.length === 0 ? (
        <p className="viewsPlaceholder">No views yet. Open any car&apos;s page and it will show up here.</p>
      ) : (
        <>
          <MostViewedCars cars={viewedCars.slice(0, TOP_N)} />
          <MostViewedBrands brands={viewedBrands.slice(0, TOP_N)} />
        </>
      )}
    </section>
  );
}