import { useState } from "react";

type Props = {
  id: string;
  initialBody: string;
  onSave: (id: string, body: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
};

export default function CommentOwnerControls({ id, initialBody, onSave, onDelete }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(initialBody);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function handleSave() {
    if (draft.trim().length < 5 || draft.length > 2000) {
      setErr("Comment must be 5–2000 characters.");
      return;
    }
    setBusy(true);
    setErr(null);
    try {
      await onSave(id, draft.trim());
      setIsEditing(false);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Failed to save changes.");
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Delete this comment? This cannot be undone.")) return;
    setBusy(true);
    setErr(null);
    try {
      await onDelete(id);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Failed to delete comment.");
      setBusy(false);
    }
  }

  if (!isEditing) {
    return (
      <div
        className="comment-actions"
        aria-label="Your comment actions"
        style={{ display: "flex", gap: "0.4rem", marginTop: "0.4rem" }}
      >
        <button
          type="button"
          onClick={() => setIsEditing(true)}
          disabled={busy}
          title="Edit your comment"
          aria-label="Edit your comment"
        >
          ✏️
        </button>
        <button
          type="button"
          onClick={handleDelete}
          disabled={busy}
          title="Delete your comment"
          aria-label="Delete your comment"
        >
          🗑️
        </button>
        {err && <div className="error" style={{ marginLeft: ".5rem" }}>{err}</div>}
      </div>
    );
  }

  return (
    <div style={{ marginTop: ".25rem" }}>
      <label className="sr-only" htmlFor={`edit-${id}`}>Edit comment</label>
      <textarea
        id={`edit-${id}`}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        maxLength={2000}
        rows={4}
        style={{ width: "100%" }}
      />
      <div style={{ display: "flex", gap: ".5rem", marginTop: ".4rem" }}>
        <button
          type="button"
          onClick={handleSave}
          disabled={busy}
          title="Save changes"
          aria-label="Save changes"
        >
          Save
        </button>
        <button
          type="button"
          onClick={() => {
            setDraft(initialBody);
            setIsEditing(false);
            setErr(null);
          }}
          disabled={busy}
          title="Cancel edit"
          aria-label="Cancel edit"
        >
          Cancel
        </button>
      </div>
      {err && <div className="error" style={{ marginTop: ".4rem" }}>{err}</div>}
    </div>
  );
}