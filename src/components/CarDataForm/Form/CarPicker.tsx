import { useMemo, useState } from "react";
import type { Car } from "@/types/shared/car";

type Props = {
  cars: Car[];
  brands: string[];
  selectedKeys: string[];
  onToggleKey: (key: string) => void;
};

function carKey(c: Car): string {
  return c.normalizedKey || String(c.id);
}

export default function CarPicker({ cars, brands, selectedKeys, onToggleKey }: Props): JSX.Element {
  const [brand, setBrand] = useState("");
  const [query, setQuery] = useState("");

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
      <div className="CarPickerControls">
        <label className="CarDataFormLabel">
          Brand
          <select value={brand} onChange={(e) => setBrand(e.target.value)}>
            <option value="">All brands</option>
            {brands.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </label>

        <label className="CarDataFormLabel">
          Search (brand/model/key)
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. Lamborghini, Aventador, wmotors"
          />
        </label>

        <div className="CarPickerBtns">
          <button type="button" onClick={selectAllFiltered}>
            Select filtered
          </button>
          <button type="button" onClick={unselectFiltered}>
            Unselect filtered
          </button>
        </div>
      </div>

      <div className="CarPickerList" role="list">
        {filtered.map((c) => {
          const k = carKey(c);
          const checked = selectedSet.has(k);
          return (
            <label key={k} className="CarPickerItem">
              <input type="checkbox" checked={checked} onChange={() => onToggleKey(k)} />
              <div className="CarPickerText">
                <div className="CarPickerMain">
                  {c.brand} {c.model}
                </div>
                <div className="CarPickerMeta">
                  {c.class} • {c.rarity} • {c.stars}★
                </div>
              </div>
            </label>
          );
        })}
      </div>

      <p className="CarDataFormHint">Showing {filtered.length} (capped at 250)</p>
    </div>
  );
}