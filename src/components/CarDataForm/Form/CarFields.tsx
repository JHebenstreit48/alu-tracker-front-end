import { useMemo, useRef, useState } from "react";
import type { Car } from "@/types/shared/car";
import type { ObtainableViaEntry } from "@/types/shared/car";

type Props = {
  selectedKeys: string[];
  selectedCars: Car[];
  onApply: (partial: Record<string, unknown>) => void;
};

type KeyCarMode = "no-change" | "set-true" | "set-false";

const OV_STATUSES = [
  "original", "upcoming", "current", "recent", "inactive", "obsolete",
] as const;

type OvStatus = (typeof OV_STATUSES)[number];

type OvEntryDraft = {
  id: number;
  status: OvStatus;
  methods: string[];
};

const STATUS_LABELS: Record<OvStatus, string> = {
  original: "Original",
  upcoming: "Upcoming",
  current: "Current",
  recent: "Recent",
  inactive: "Inactive",
  obsolete: "Obsolete",
};

let _nextId = 0;
const nextId = () => ++_nextId;

export default function CarFields({
  selectedKeys,
  selectedCars,
  onApply,
}: Props): JSX.Element {
  const [brand,      setBrand]      = useState("");
  const [model,      setModel]      = useState("");
  const [klass,      setKlass]      = useState("");
  const [rarity,     setRarity]     = useState("");
  const [stars,      setStars]      = useState("");
  const [country,    setCountry]    = useState("");
  const [keyCarMode, setKeyCarMode] = useState<KeyCarMode>("no-change");
  const [ovEntries,  setOvEntries]  = useState<OvEntryDraft[]>([]);

  const methodInputRefs = useRef<Record<number, HTMLInputElement | null>>({});
  const disabled = selectedKeys.length === 0;

  const preview = useMemo(() => {
    const n = selectedCars.length;
    if (!n) return "No cars selected.";
    if (n === 1) return `${selectedCars[0].brand} ${selectedCars[0].model}`;
    return `${n} cars selected`;
  }, [selectedCars]);

  const addOvEntry = () =>
    setOvEntries((prev) => [
      ...prev,
      { id: nextId(), status: "current", methods: [] },
    ]);

  const removeOvEntry = (id: number) =>
    setOvEntries((prev) => prev.filter((e) => e.id !== id));

  const setOvStatus = (id: number, status: OvStatus) =>
    setOvEntries((prev) =>
      prev.map((e) => (e.id === id ? { ...e, status } : e))
    );

  const addMethod = (id: number) => {
    const inp = methodInputRefs.current[id];
    if (!inp) return;
    const val = inp.value.trim();
    if (!val) return;
    setOvEntries((prev) =>
      prev.map((e) =>
        e.id === id && !e.methods.includes(val)
          ? { ...e, methods: [...e.methods, val] }
          : e
      )
    );
    inp.value = "";
    inp.focus();
  };

  const removeMethod = (id: number, method: string) =>
    setOvEntries((prev) =>
      prev.map((e) =>
        e.id === id
          ? { ...e, methods: e.methods.filter((m) => m !== method) }
          : e
      )
    );

  const handleMethodKeyDown = (e: React.KeyboardEvent, id: number) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addMethod(id);
    }
  };

  const apply = () => {
    if (disabled) return;
    const partial: Record<string, unknown> = {};
    if (brand.trim())   partial.brand   = brand.trim();
    if (model.trim())   partial.model   = model.trim();
    if (klass.trim())   partial.class   = klass.trim();
    if (rarity.trim())  partial.rarity  = rarity.trim();
    if (country.trim()) partial.country = country.trim();

    const s = stars.trim();
    if (s !== "" && !isNaN(Number(s))) partial.stars = Number(s);

    if (keyCarMode === "set-true")  partial.keyCar = true;
    if (keyCarMode === "set-false") partial.keyCar = false;

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
            <select
              value={keyCarMode}
              onChange={(e) => setKeyCarMode(e.target.value as KeyCarMode)}
            >
              <option value="no-change">No change</option>
              <option value="set-true">Set ON</option>
              <option value="set-false">Set OFF</option>
            </select>
          </label>
        </div>
      </div>

      <div className="CarFieldsOvSection">
        <div className="CarFieldsOvHeader">
          <h3 className="CarFieldsOvTitle">Obtainable Via</h3>
          <button type="button" onClick={addOvEntry}>+ Add Entry</button>
        </div>

        {ovEntries.length === 0 && (
          <p className="CarDataFormHint">
            No entries — click "+ Add Entry" to define how this car can be obtained.
          </p>
        )}

        <div className="CarFieldsOvList">
          {ovEntries.map((entry) => (
            <div key={entry.id} className={`OvEntry OvEntry--${entry.status}`}>
              <div className="OvEntry__header">
                <span className={`OvEntry__badge OvEntry__badge--${entry.status}`}>
                  {STATUS_LABELS[entry.status]}
                </span>
                <select
                  className="OvEntry__statusSelect"
                  value={entry.status}
                  onChange={(e) => setOvStatus(entry.id, e.target.value as OvStatus)}
                >
                  {OV_STATUSES.map((s) => (
                    <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                  ))}
                </select>
                <button
                  type="button"
                  className="OvEntry__removeBtn"
                  onClick={() => removeOvEntry(entry.id)}
                >
                  ✕ Remove
                </button>
              </div>

              <div className="OvEntry__methods">
                {entry.methods.length === 0 && (
                  <span className="OvEntry__noMethods">No methods yet</span>
                )}
                {entry.methods.map((m) => (
                  <span key={m} className="OvEntry__pill">
                    {m}
                    <button
                      type="button"
                      className="OvEntry__pillRemove"
                      onClick={() => removeMethod(entry.id, m)}
                    >×</button>
                  </span>
                ))}
              </div>

              <div className="OvEntry__addRow">
                <input
                  ref={(el) => { methodInputRefs.current[entry.id] = el; }}
                  placeholder="Method name (e.g. Legend Store, Festival, Box…)"
                  onKeyDown={(e) => handleMethodKeyDown(e, entry.id)}
                />
                <button type="button" onClick={() => addMethod(entry.id)}>Add</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="CarDataFormRow">
        <button type="button" onClick={apply} disabled={disabled}>
          Apply fields to selected
        </button>
      </div>
      <p className="CarDataFormHint">
        Leaving an input blank means "don't change that field".
      </p>
    </div>
  );
}