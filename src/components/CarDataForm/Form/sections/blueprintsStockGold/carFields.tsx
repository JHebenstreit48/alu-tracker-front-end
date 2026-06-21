import { useMemo, useState } from 'react';
import type { Car } from '@/types/shared/car';
import type { ObtainableViaEntry } from '@/types/shared/car';
import CarFieldsGrid from '@/components/CarDataForm/Form/sections/blueprintsStockGold/carFieldsGrid';
import type { KeyCarMode } from '@/components/CarDataForm/Form/sections/blueprintsStockGold/carFieldsGrid';
import ObtainableVia from '@/components/CarDataForm/Form/sections/blueprintsStockGold/obtainableVia';
import type { OvEntryDraft } from '@/components/CarDataForm/Form/sections/blueprintsStockGold/obtainableVia';

type Props = {
  selectedKeys: string[];
  selectedCars: Car[];
  onApply: (partial: Record<string, unknown>) => void;
};

export default function CarFields({ selectedKeys, selectedCars, onApply }: Props): JSX.Element {
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [klass, setKlass] = useState('');
  const [rarity, setRarity] = useState('');
  const [stars, setStars] = useState('');
  const [country, setCountry] = useState('');
  const [keyCarMode, setKeyCarMode] = useState<KeyCarMode>('no-change');
  const [ovEntries, setOvEntries] = useState<OvEntryDraft[]>([]);

  const disabled = selectedKeys.length === 0;

  const preview = useMemo(() => {
    const n = selectedCars.length;
    if (!n) return 'No cars selected.';
    if (n === 1) return `${selectedCars[0].brand} ${selectedCars[0].model}`;
    return `${n} cars selected`;
  }, [selectedCars]);

  const apply = () => {
    if (disabled) return;
    const partial: Record<string, unknown> = {};
    if (brand.trim()) partial.brand = brand.trim();
    if (model.trim()) partial.model = model.trim();
    if (klass.trim()) partial.class = klass.trim();
    if (rarity.trim()) partial.rarity = rarity.trim();
    if (country.trim()) partial.country = country.trim();

    const s = stars.trim();
    if (s !== '' && !isNaN(Number(s))) partial.stars = Number(s);

    if (keyCarMode === 'set-true') partial.keyCar = true;
    if (keyCarMode === 'set-false') partial.keyCar = false;

    if (ovEntries.length > 0) {
      const built: ObtainableViaEntry[] = ovEntries
        .filter((e) => e.methods.length > 0)
        .map((e) => ({ status: e.status, methods: e.methods }));
      if (built.length > 0) partial.obtainableVia = built;
    }

    onApply(partial);
  };

  return (
    <div className="CarFields">
      <p className="CarDataFormHint">
        Apply changes to selected cars: <strong>{preview}</strong>
      </p>

      <CarFieldsGrid
        brand={brand}
        setBrand={setBrand}
        model={model}
        setModel={setModel}
        klass={klass}
        setKlass={setKlass}
        rarity={rarity}
        setRarity={setRarity}
        stars={stars}
        setStars={setStars}
        country={country}
        setCountry={setCountry}
        keyCarMode={keyCarMode}
        setKeyCarMode={setKeyCarMode}
      />

      <ObtainableVia ovEntries={ovEntries} setOvEntries={setOvEntries} />

      <div className="CarDataFormRow">
        <button type="button" onClick={apply} disabled={disabled}>
          Apply fields to selected
        </button>
      </div>
      <p className="CarDataFormHint">Leaving an input blank means "don't change that field".</p>
    </div>
  );
}