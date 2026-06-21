export type KeyCarMode = 'no-change' | 'set-true' | 'set-false';

type Props = {
  brand: string;
  setBrand: (v: string) => void;
  model: string;
  setModel: (v: string) => void;
  klass: string;
  setKlass: (v: string) => void;
  rarity: string;
  setRarity: (v: string) => void;
  stars: string;
  setStars: (v: string) => void;
  country: string;
  setCountry: (v: string) => void;
  keyCarMode: KeyCarMode;
  setKeyCarMode: (v: KeyCarMode) => void;
};

export default function CarFieldsGrid({
  brand,
  setBrand,
  model,
  setModel,
  klass,
  setKlass,
  rarity,
  setRarity,
  stars,
  setStars,
  country,
  setCountry,
  keyCarMode,
  setKeyCarMode,
}: Props): JSX.Element {
  return (
    <div className="CarFieldsGrid">
      <label className="CarDataFormLabel">
        Brand
        <input value={brand} onChange={(e) => setBrand(e.target.value)} placeholder="W Motors" />
      </label>
      <label className="CarDataFormLabel">
        Model
        <input value={model} onChange={(e) => setModel(e.target.value)} placeholder="Fenyr Supersport" />
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
  );
}