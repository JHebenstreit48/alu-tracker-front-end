import { useMemo, useState } from 'react';
import type { Car } from '@/types/shared/car';
import PickCarsControls from '@/components/CarDataForm/Form/sections/blueprintsStockGold/pickCarsControls';
import PickCarsList from '@/components/CarDataForm/Form/sections/blueprintsStockGold/pickCarsList';

type Props = {
  cars: Car[];
  brands: string[];
  selectedKeys: string[];
  onToggleKey: (key: string) => void;
};

function carKey(c: Car): string {
  return c.normalizedKey || String(c.id);
}

export default function PickCars({ cars, brands, selectedKeys, onToggleKey }: Props): JSX.Element {
  const [brand, setBrand] = useState('');
  const [query, setQuery] = useState('');

  const selectedSet = useMemo(() => new Set(selectedKeys), [selectedKeys]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return cars
      .filter((c) => (brand ? c.brand === brand : true))
      .filter((c) => {
        if (!q) return true;
        return (
          c.model.toLowerCase().includes(q) ||
          c.brand.toLowerCase().includes(q) ||
          carKey(c).toLowerCase().includes(q)
        );
      })
      .slice(0, 250);
  }, [cars, brand, query]);

  const selectAllFiltered = () => {
    for (const c of filtered) {
      const k = carKey(c);
      if (!selectedSet.has(k)) onToggleKey(k);
    }
  };

  const unselectFiltered = () => {
    for (const c of filtered) {
      const k = carKey(c);
      if (selectedSet.has(k)) onToggleKey(k);
    }
  };

  return (
    <div className="CarPicker">
      <PickCarsControls
        brand={brand}
        setBrand={setBrand}
        query={query}
        setQuery={setQuery}
        brands={brands}
        onSelectFiltered={selectAllFiltered}
        onUnselectFiltered={unselectFiltered}
      />
      <PickCarsList cars={filtered} selectedKeys={selectedSet} onToggleKey={onToggleKey} carKey={carKey} />
    </div>
  );
}