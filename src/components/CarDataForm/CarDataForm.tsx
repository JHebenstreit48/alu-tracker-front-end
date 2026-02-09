import { useContext, useMemo, useState } from "react";
import { AuthContext } from "@/context/Auth/authContext";
import { useCarIndex } from "@/hooks/CarDataSubmission/useCarIndex";
import { useCarSubmission } from "@/hooks/CarDataSubmission/useCarSubmission";
import { createSubmission } from "@/api/carSubmissionAPI";
import { buildSubmission } from "@/utils/CarDataSubmission/buildSubmission";

import CarPicker from "./CarPicker";
import CarFields from "./CarFields";
import StatsFields from "./StatsFields";

export default function CarDataForm(): JSX.Element {
  const { token } = useContext(AuthContext);
  const { cars, brands, loading, error } = useCarIndex();
  const {
    selectedKeys,
    toggleKey,
    updatePatch,
    clearAll,
    payload,
    setSubmitterNote,
    submitterNote,
  } = useCarSubmission();

  const [busy, setBusy] = useState(false);
  const [okMsg, setOkMsg] = useState<string | null>(null);
  const [errMsg, setErrMsg] = useState<string | null>(null);

  const selectedCars = useMemo(() => {
    const set = new Set(selectedKeys);
    return cars.filter((c) => set.has(c.normalizedKey || String(c.id)));
  }, [cars, selectedKeys]);

  const onSubmit = async () => {
    if (!token) return;

    setOkMsg(null);
    setErrMsg(null);

    if (!selectedKeys.length) {
      setErrMsg("Select at least one car before submitting.");
      return;
    }

    setBusy(true);
    try {
      const cleaned = buildSubmission(payload);
      await createSubmission(token, cleaned);
      setOkMsg("Submission created! Your edits are now in the review queue.");
      clearAll();
    } catch (e: any) {
      setErrMsg(e?.message || "Failed to submit");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="CarDataForm">
      <section className="card CarDataFormCard CarDataFormCard--picker">
        <h2>Pick Cars</h2>

        {loading && <p className="CarDataFormHint">Loading cars…</p>}
        {error && <p className="CarDataFormError">{error}</p>}

        {!loading && !error && (
          <CarPicker
            cars={cars}
            brands={brands}
            selectedKeys={selectedKeys}
            onToggleKey={toggleKey}
          />
        )}

        <p className="CarDataFormHint">
          Selected: <strong>{selectedKeys.length}</strong>
        </p>
      </section>

      <section className="card CarDataFormCard CarDataFormCard--fields">
        <h2>Car Fields</h2>
        <CarFields
          selectedKeys={selectedKeys}
          selectedCars={selectedCars}
          onApply={(partial) => selectedKeys.forEach((k) => updatePatch(k, partial))}
        />
      </section>

      <section className="card CarDataFormCard CarDataFormCard--stats">
        <h2>Stats</h2>
        <StatsFields
          selectedKeys={selectedKeys}
          onApplyStats={(statsPatch) =>
            selectedKeys.forEach((k) => updatePatch(k, { stats: statsPatch }))
          }
        />
      </section>

      <section className="card CarDataFormCard CarDataFormCard--submit">
        <h2>Submit</h2>

        <label className="CarDataFormLabel">
          Submitter note (optional)
          <textarea
            value={submitterNote}
            onChange={(e) => setSubmitterNote(e.target.value)}
            placeholder="What changed, where you found it, links/sources, etc."
            rows={4}
          />
        </label>

        <div className="CarDataFormRow">
          <button type="button" onClick={onSubmit} disabled={busy || !selectedKeys.length}>
            {busy ? "Submitting…" : "Submit Changes"}
          </button>

          <button type="button" onClick={clearAll} disabled={busy}>
            Clear
          </button>
        </div>

        {okMsg && <div className="CarDataFormMsg CarDataFormMsg--ok">{okMsg}</div>}
        {errMsg && <div className="CarDataFormMsg CarDataFormMsg--err">{errMsg}</div>}
      </section>
    </div>
  );
}