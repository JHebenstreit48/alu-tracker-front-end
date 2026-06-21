import { OV_STATUSES, STATUS_LABELS } from '@/types/CarDataSubmission/tabs/blueprintsStockGold/obtainableVia';
import type { OvEntryDraft, OvStatus } from '@/types/CarDataSubmission/tabs/blueprintsStockGold/obtainableVia';

type Props = {
  entry: OvEntryDraft;
  onStatusChange: (id: number, status: OvStatus) => void;
  onRemoveEntry: (id: number) => void;
  onRemoveMethod: (id: number, method: string) => void;
  onMethodInputRef: (id: number, el: HTMLInputElement | null) => void;
  onMethodKeyDown: (e: React.KeyboardEvent, id: number) => void;
  onAddMethod: (id: number) => void;
};

export default function ObtainableViaEntry({
  entry,
  onStatusChange,
  onRemoveEntry,
  onRemoveMethod,
  onMethodInputRef,
  onMethodKeyDown,
  onAddMethod,
}: Props): JSX.Element {
  return (
    <div className={`OvEntry OvEntry--${entry.status}`}>
      <div className="OvEntry__header">
        <span className={`OvEntry__badge OvEntry__badge--${entry.status}`}>{STATUS_LABELS[entry.status]}</span>
        <select
          className="OvEntry__statusSelect"
          value={entry.status}
          onChange={(e) => onStatusChange(entry.id, e.target.value as OvStatus)}
        >
          {OV_STATUSES.map((s) => (
            <option key={s} value={s}>
              {STATUS_LABELS[s]}
            </option>
          ))}
        </select>
        <button type="button" className="OvEntry__removeBtn" onClick={() => onRemoveEntry(entry.id)}>
          ✕ Remove
        </button>
      </div>

      <div className="OvEntry__methods">
        {entry.methods.length === 0 && <span className="OvEntry__noMethods">No methods yet</span>}
        {entry.methods.map((m) => (
          <span key={m} className="OvEntry__pill">
            {m}
            <button type="button" className="OvEntry__pillRemove" onClick={() => onRemoveMethod(entry.id, m)}>
              ×
            </button>
          </span>
        ))}
      </div>

      <div className="OvEntry__addRow">
        <input
          ref={(el) => onMethodInputRef(entry.id, el)}
          placeholder="Method name (e.g. Legend Store, Festival, Box…)"
          onKeyDown={(e) => onMethodKeyDown(e, entry.id)}
        />
        <button type="button" onClick={() => onAddMethod(entry.id)}>
          Add
        </button>
      </div>
    </div>
  );
}