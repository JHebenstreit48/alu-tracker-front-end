import { useEffect, useState } from "react";
import type { CommentType } from "@/components/CarInformation/CarDetails/OtherComponents/Comments/types";

type Props = {
  token: string | null;
  username?: string | null;
  onSubmit: (
    type: CommentType,
    body: string,
    authorName?: string,
    authorEmail?: string,
    hp?: string
  ) => Promise<void | { ok: true; id?: string; editKey?: string; localOnly?: boolean }>;
};

export default function CommentForm({ token, onSubmit }: Props) {
  const [type, setType] = useState<CommentType>("general");
  const [body, setBody] = useState("");
  const [authorName, setAuthorName] = useState(localStorage.getItem("commentAuthorName") || "");
  const [authorEmail, setAuthorEmail] = useState(localStorage.getItem("commentAuthorEmail") || "");
  const [hp, setHp] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const maxLen = 2000;

  const remaining = maxLen - body.length;
  const canSubmit = body.trim().length >= 5 && body.length <= maxLen;

  useEffect(() => { localStorage.setItem("commentAuthorName", authorName); }, [authorName]);
  useEffect(() => { localStorage.setItem("commentAuthorEmail", authorEmail); }, [authorEmail]);
  useEffect(() => {
    if (!submitted) return;
    const t = setTimeout(() => setSubmitted(false), 2500);
    return () => clearTimeout(t);
  }, [submitted]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit || submitting) return;
    setSubmitting(true); setError(null);
    try {
      const res = await onSubmit(
        type,
        body,
        token ? undefined : authorName || undefined,
        token ? undefined : authorEmail || undefined,
        hp
      );
      setSubmitted(true);
      setBody(""); setType("general");
      if (res && res.id && res.editKey) localStorage.setItem(`comment_editkey_${res.id}`, res.editKey);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to submit comment.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="comments-panel">
      <h2 className="comments-title">Leave a comment</h2>
      <form className="comments-form" onSubmit={handleSubmit} noValidate>
        <div className="row">
          <label htmlFor="comment-type">Type</label>
          <select id="comment-type" value={type} onChange={(e) => setType(e.target.value as CommentType)}>
            <option value="general">General</option>
            <option value="missing-data">Missing data</option>
            <option value="correction">Correction</option>
          </select>
        </div>

        <div className="row">
          <label htmlFor="comment-body">Your comment</label>
          <textarea
            id="comment-body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            maxLength={maxLen}
            rows={5}
            placeholder="Share a correction, missing detail, or general feedback about this car…"
          />
          <div className={`char-count ${remaining < 0 ? "over" : ""}`}>{remaining} / {maxLen}</div>
        </div>

        {!token && (
          <div className="row grid">
            <div className="col">
              <label htmlFor="comment-name">Name (optional)</label>
              <input id="comment-name" type="text" value={authorName} onChange={(e) => setAuthorName(e.target.value)} maxLength={120} autoComplete="name" />
            </div>
            <div className="col">
              <label htmlFor="comment-email">Email (optional)</label>
              <input id="comment-email" type="email" value={authorEmail} onChange={(e) => setAuthorEmail(e.target.value)} maxLength={254} autoComplete="email" />
            </div>
          </div>
        )}

        <input type="text" name="hp" value={hp} onChange={(e) => setHp(e.target.value)} className="hp" aria-hidden="true" tabIndex={-1} autoComplete="off" />

        {error && <div className="error">{error}</div>}
        {submitted ? (
          <div className="success" role="status" aria-live="polite">Thanks — comment posted!</div>
        ) : (
          <button type="submit" className="submit" disabled={!canSubmit || submitting}>
            {submitting ? "Submitting…" : "Submit comment"}
          </button>
        )}
      </form>
    </section>
  );
}
