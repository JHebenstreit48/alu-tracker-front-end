import { useRef } from 'react';

export const OV_STATUSES = [
  "original", "upcoming", "current", "recent", "inactive", "obsolete",
] as const;

export type OvStatus = (typeof OV_STATUSES)[number];

export type OvEntryDraft = {
  id: number;
  status: OvStatus;
  methods: string[];
};

export const STATUS_LABELS: Record<OvStatus, string> = {
  original: "Original",
  upcoming: "Upcoming",
  current: "Current",
  recent: "Recent",
  inactive: "Inactive",
  obsolete: "Obsolete",
};

let _nextId = 0;
export const nextId = () => ++_nextId;

type Props = {
  ovEntries: OvEntryDraft[];
  setOvEntries: React.Dispatch<React.SetStateAction<OvEntryDraft[]>>;
};

export default function ObtainableVia({ ovEntries, setOvEntries }: Props) {
  const methodInputRefs = useRef<Record<number, HTMLInputElement | null>>({});

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

  return (
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
  );
}