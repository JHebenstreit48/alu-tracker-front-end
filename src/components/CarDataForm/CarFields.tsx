import { useMemo, useState } from "react";
import type { Car } from "@/types/shared/car";

type Props = {
  selectedKeys: string[];
  selectedCars: Car[];
  onApply: (partial: Record<string, unknown>) => void;
};

type KeyCarMode = "no-change" | "set-true" | "set-false";

export default function CarFields({ selectedKeys, selectedCars, onApply }: Props): JSX.Element {
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [klass, setKlass] = useState("");
  const [rarity, setRarity] = useState("");
  const [stars, setStars] = useState("");
  const [country, setCountry] = useState("");
  const [keyCarMode, setKeyCarMode] = useState<KeyCarMode>("no-change");

  const disabled = selectedKeys.length === 0;

  const preview = useMemo(() => {
    const n = selectedCars.length;
    if (!n) return "No cars selected.";
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
    if (s !== "" && !isNaN(Number(s))) partial.stars = Number(s);

    if (keyCarMode === "set-true") partial.keyCar = true;
    if (keyCarMode === "set-false") partial.keyCar = false;

    onApply(partial);
  };

  return (
    <div className="CarFields">
      <p className="CarDataFormHint">
        Apply changes to selected cars: <strong>{preview}</strong>
      </p>

      <div className="CarFieldsGrid">
        <label className="CarDataFormLabel">
          Brand
          <input value={brand} onChange={(e) => setBrand(e.target.value)} placeholder="W Motors" />
        </label>

        <label className="CarDataFormLabel">
          Model
          <input
            value={model}
            onChange={(e) => setModel(e.target.value)}
            placeholder="Fenyr Supersport"
          />
        </label>

        <label className="CarDataFormLabel">
          Class
          <input value={klass} onChange={(e) => setKlass(e.target.value)} placeholder="S" />
        </label>

        <label className="CarDataFormLabel">
          Rarity
          <input value={rarity} onChange={(e) => setRarity(e.target.value)} placeholder="Epic" />
        </label>

        <label className="CarDataFormLabel">
          Stars
          <input value={stars} onChange={(e) => setStars(e.target.value)} placeholder="6" inputMode="numeric" />
        </label>

        <label className="CarDataFormLabel">
          Country
          <input value={country} onChange={(e) => setCountry(e.target.value)} placeholder="UAE" />
        </label>

        <div className="CarFieldsKeyCarCenter">
          <label className="CarDataFormLabel CarFieldsKeyCarSelect">
            Key car
            <select value={keyCarMode} onChange={(e) => setKeyCarMode(e.target.value as KeyCarMode)}>
              <option value="no-change">No change</option>
              <option value="set-true">Set ON</option>
              <option value="set-false">Set OFF</option>
            </select>
          </label>
        </div>
      </div>

      <div className="CarDataFormRow">
        <button type="button" onClick={apply} disabled={disabled}>
          Apply fields to selected
        </button>
      </div>

      <p className="CarDataFormHint">Leaving an input blank means “don’t change that field”.</p>
    </div>
  );
}