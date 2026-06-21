import { useRef } from 'react';
import { ObtainableViaEntry } from '@/components/CarDataForm/Form/sections/blueprintsStockGold/obtainableVia/index';
import type { OvEntryDraft, OvStatus } from '@/types/CarDataSubmission/tabs/blueprintsStockGold/obtainableVia';

export type { OvEntryDraft } from '@/types/CarDataSubmission/tabs/blueprintsStockGold/obtainableVia';

let _nextId = 0;
const nextId = () => ++_nextId;

type Props = {
  ovEntries: OvEntryDraft[];
  setOvEntries: React.Dispatch<React.SetStateAction<OvEntryDraft[]>>;
};

export default function ObtainableVia({ ovEntries, setOvEntries }: Props): JSX.Element {
  const methodInputRefs = useRef<Record<number, HTMLInputElement | null>>({});

  const addOvEntry = () => setOvEntries((prev) => [...prev, { id: nextId(), status: 'current', methods: [] }]);

  const removeOvEntry = (id: number) => setOvEntries((prev) => prev.filter((e) => e.id !== id));

  const setOvStatus = (id: number, status: OvStatus) =>
    setOvEntries((prev) => prev.map((e) => (e.id === id ? { ...e, status } : e)));

  const addMethod = (id: number) => {
    const inp = methodInputRefs.current[id];
    if (!inp) return;
    const val = inp.value.trim();
    if (!val) return;
    setOvEntries((prev) =>
      prev.map((e) => (e.id === id && !e.methods.includes(val) ? { ...e, methods: [...e.methods, val] } : e))
    );
    inp.value = '';
    inp.focus();
  };

  const removeMethod = (id: number, method: string) =>
    setOvEntries((prev) =>
      prev.map((e) => (e.id === id ? { ...e, methods: e.methods.filter((m) => m !== method) } : e))
    );

  const handleMethodKeyDown = (e: React.KeyboardEvent, id: number) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addMethod(id);
    }
  };

  const setMethodInputRef = (id: number, el: HTMLInputElement | null) => {
    methodInputRefs.current[id] = el;
  };

  return (
    <div className="CarFieldsOvSection">
      <div className="CarFieldsOvHeader">
        <h3 className="CarFieldsOvTitle">Obtainable Via</h3>
        <button type="button" onClick={addOvEntry}>
          + Add Entry
        </button>
      </div>

      {ovEntries.length === 0 && (
        <p className="CarDataFormHint">No entries — click "+ Add Entry" to define how this car can be obtained.</p>
      )}

      <div className="CarFieldsOvList">
        {ovEntries.map((entry) => (
          <ObtainableViaEntry
            key={entry.id}
            entry={entry}
            onStatusChange={setOvStatus}
            onRemoveEntry={removeOvEntry}
            onRemoveMethod={removeMethod}
            onMethodInputRef={setMethodInputRef}
            onMethodKeyDown={handleMethodKeyDown}
            onAddMethod={addMethod}
          />
        ))}
      </div>
    </div>
  );
}