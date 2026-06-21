type Props = {
  brand: string;
  setBrand: (v: string) => void;
  query: string;
  setQuery: (v: string) => void;
  brands: string[];
  onSelectFiltered: () => void;
  onUnselectFiltered: () => void;
};

export default function PickCarsControls({
  brand,
  setBrand,
  query,
  setQuery,
  brands,
  onSelectFiltered,
  onUnselectFiltered,
}: Props): JSX.Element {
  return (
    <div className="CarPickerControls">
      <label className="CarDataFormLabel">
        Brand
        <select
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
        >
          <option value="">All brands</option>
          {brands.map((b) => (
            <option
              key={b}
              value={b}
            >
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
        <button
          type="button"
          onClick={onSelectFiltered}
        >
          Select filtered
        </button>
        <button
          type="button"
          onClick={onUnselectFiltered}
        >
          Unselect filtered
        </button>
      </div>
    </div>
  );
}