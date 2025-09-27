import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/components/SignupLogin/hooks/useAuth";
import Card, { type CommentCardItem } from "./Card";
import "@/scss/Cars/CarComments.scss";

type CommentType = "missing-data" | "correction" | "general";
type Filter = "all" | CommentType;

type CommentItem = CommentCardItem & {
  normalizedKey: string;
  brand?: string;
  model?: string;
  status: "visible" | "pending" | "hidden";
  updatedAt: string;
};

type ErrorPayload = { code: string; message: string; details?: unknown };
type CommentsListData = { comments: CommentItem[] };
type ApiOk<T> = { ok: true; data: T };
type ApiErr = { ok: false; error: ErrorPayload };
type ApiResponse<T> = ApiOk<T> | ApiErr;

type CreateCommentData = {
  id: string;
  status?: "visible" | "pending" | "hidden";
  editKey?: string;
};

interface Props {
  normalizedKey: string;
  brand?: string;
  model?: string;
}

const COMMENTS_BASE =
  import.meta.env.VITE_COMMENTS_API_BASE_URL?.replace(/\/+$/, "") || "http://127.0.0.1:3004";

/* ---------- helpers (no any) ---------- */
function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}
function isApiResponseComments(v: unknown): v is ApiResponse<CommentsListData> {
  if (!isRecord(v) || typeof v.ok !== "boolean") return false;
  if (v.ok) return isRecord(v.data) && Array.isArray((v.data as Record<string, unknown>).comments);
  const e = (v as { error?: unknown }).error;
  return isRecord(e) && typeof e.message === "string" && typeof e.code === "string";
}
function isCreateData(v: unknown): v is CreateCommentData {
  return (
    isRecord(v) &&
    typeof v.id === "string" &&
    (v.status === undefined ||
      v.status === "visible" ||
      v.status === "pending" ||
      v.status === "hidden") &&
    (v.editKey === undefined || typeof v.editKey === "string")
  );
}
function isOkWithCreateData(v: unknown): v is ApiOk<CreateCommentData> {
  return isRecord(v) && v.ok === true && isCreateData(v.data);
}
async function safeJson(res: Response): Promise<unknown> {
  try {
    return await res.json();
  } catch {
    return {};
  }
}
function apiErrorMessage(payload: unknown): string | null {
  if (!isRecord(payload)) return null;
  const e = payload.error;
  if (isRecord(e) && typeof e.message === "string") return e.message;
  return null;
}
function messageOf(e: unknown): string {
  if (e instanceof Error) return e.message;
  if (isRecord(e) && typeof (e as { message?: unknown }).message === "string") {
    return String((e as { message?: unknown }).message);
  }
  return "Unexpected error";
}

/* ---------- Component ---------- */
export default function Panel({ normalizedKey, brand, model }: Props) {
  const auth = useAuth?.();
  const token = auth?.token ?? null;
  const username = auth?.username ?? null;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [filter, setFilter] = useState<Filter>("all");

  // form state
  const [type, setType] = useState<CommentType>("general");
  const [body, setBody] = useState("");
  const [authorName, setAuthorName] = useState(localStorage.getItem("commentAuthorName") || "");
  const [authorEmail, setAuthorEmail] = useState(localStorage.getItem("commentAuthorEmail") || "");
  const [hp, setHp] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const maxLen = 2000;

  // Admin actions only if a key exists in sessionStorage.
  const adminKey = sessionStorage.getItem("commentsAdminKey") || "";
  const canModerate = adminKey.length > 0;

  const fetchList = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const r = await fetch(`${COMMENTS_BASE}/api/comments/${encodeURIComponent(normalizedKey)}`);
      const j = await safeJson(r);
      if (isApiResponseComments(j) && (j as ApiResponse<CommentsListData>).ok) {
        setComments((j as ApiOk<CommentsListData>).data.comments);
      } else {
        setError("Failed to load comments.");
      }
    } catch (e) {
      setError(messageOf(e));
    } finally {
      setLoading(false);
    }
  }, [normalizedKey]);

  useEffect(() => { void fetchList(); }, [fetchList]);

  useEffect(() => { localStorage.setItem("commentAuthorName", authorName); }, [authorName]);
  useEffect(() => { localStorage.setItem("commentAuthorEmail", authorEmail); }, [authorEmail]);

  // Auto-hide the success toast after a short delay
  useEffect(() => {
    if (!submitted) return;
    const t = setTimeout(() => setSubmitted(false), 2500);
    return () => clearTimeout(t);
  }, [submitted]);

  const filtered = useMemo(() => {
    if (filter === "all") return comments;
    return comments.filter((c) => c.type === filter);
  }, [comments, filter]);

  const remaining = maxLen - body.length;
  const canSubmit = body.trim().length >= 5 && body.length <= maxLen;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit || submitting) return;

    setSubmitting(true);
    setError(null);

    try {
      const headers: HeadersInit = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const payload = {
        normalizedKey,
        brand,
        model,
        type,
        body: body.trim(),
        authorName: token ? username ?? undefined : authorName || undefined,
        authorEmail: token ? undefined : authorEmail || undefined,
        hp
      };

      const r = await fetch(`${COMMENTS_BASE}/api/comments`, {
        method: "POST",
        headers,
        body: JSON.stringify(payload)
      });

      const j = await safeJson(r);
      if (!r.ok || !isOkWithCreateData(j)) {
        const msg = apiErrorMessage(j) ?? "Failed to submit comment.";
        throw new Error(msg);
      }

      const id = (j as ApiOk<CreateCommentData>).data.id;
      const editKey = (j as ApiOk<CreateCommentData>).data.editKey;
      if (id && editKey) {
        localStorage.setItem(`comment_editkey_${id}`, editKey);
      }

      setSubmitted(true);
      setBody("");
      setType("general");
      await fetchList();
    } catch (e) {
      setError(messageOf(e));
    } finally {
      setSubmitting(false);
    }
  }

  async function callAdmin(method: "PATCH" | "DELETE", id: string, action?: "visible" | "hide") {
    if (!canModerate) return;
    const url =
      method === "DELETE"
        ? `${COMMENTS_BASE}/api/comments/${encodeURIComponent(id)}`
        : `${COMMENTS_BASE}/api/comments/${encodeURIComponent(id)}/${action}`;
    const r = await fetch(url, { method, headers: { "x-admin-key": adminKey } });
    const j = await safeJson(r);
    if (!r.ok || !isRecord(j) || (j as { ok?: unknown }).ok !== true) {
      throw new Error("Admin action failed");
    }
    await fetchList();
  }

  // ---- Self edit/delete (guest via editKey) ----
  async function saveSelf(id: string, newBody: string): Promise<void> {
    const key = localStorage.getItem(`comment_editkey_${id}`) || "";
    if (!key) throw new Error("Missing edit key for this comment.");

    // optimistic update
    const prev = comments;
    const next = prev.map((c) => (c._id === id ? { ...c, body: newBody } : c));
    setComments(next);

    try {
      const r = await fetch(`${COMMENTS_BASE}/api/comments/${encodeURIComponent(id)}/self`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: newBody, editKey: key })
      });
      if (!r.ok) {
        const j = await safeJson(r);
        const m = apiErrorMessage(j) ?? `Failed to save (${r.status})`;
        throw new Error(m);
      }
    } catch (e) {
      setComments(comments); // rollback
      throw e instanceof Error ? e : new Error("Failed to save changes.");
    }
  }

  async function deleteSelf(id: string): Promise<void> {
    const key = localStorage.getItem(`comment_editkey_${id}`) || "";
    if (!key) throw new Error("Missing edit key for this comment.");

    // optimistic removal
    const prev = comments;
    const next = prev.filter((c) => c._id !== id);
    setComments(next);

    try {
      const r = await fetch(`${COMMENTS_BASE}/api/comments/${encodeURIComponent(id)}/self`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ editKey: key })
      });
      if (!r.ok) {
        const j = await safeJson(r);
        const m = apiErrorMessage(j) ?? `Failed to delete (${r.status})`;
        throw new Error(m);
      }
      localStorage.removeItem(`comment_editkey_${id}`);
    } catch (e) {
      setComments(comments); // rollback
      throw e instanceof Error ? e : new Error("Failed to delete comment.");
    }
  }

  return (
    <>
      {/* --- Submission card --- */}
      <section className="comments-panel">
        <h2 className="comments-title">Leave a comment</h2>

        <form className="comments-form" onSubmit={handleSubmit} noValidate>
          <div className="row">
            <label htmlFor="comment-type">Type</label>
            <select
              id="comment-type"
              value={type}
              onChange={(e) => setType(e.target.value as CommentType)}
            >
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
            <div className={`char-count ${remaining < 0 ? "over" : ""}`}>
              {remaining} / {maxLen}
            </div>
          </div>

          {!token && (
            <div className="row grid">
              <div className="col">
                <label htmlFor="comment-name">Name (optional)</label>
                <input
                  id="comment-name"
                  type="text"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  maxLength={120}
                  placeholder="Your display name"
                  autoComplete="name"
                />
              </div>
              <div className="col">
                <label htmlFor="comment-email">Email (optional)</label>
                <input
                  id="comment-email"
                  type="email"
                  value={authorEmail}
                  onChange={(e) => setAuthorEmail(e.target.value)}
                  maxLength={254}
                  placeholder="Only used to link comments if you make an account later"
                  autoComplete="email"
                />
              </div>
            </div>
          )}

          {/* Honeypot */}
          <input
            type="text"
            name="hp"
            value={hp}
            onChange={(e) => setHp(e.target.value)}
            className="hp"
            aria-hidden="true"
            tabIndex={-1}
            autoComplete="off"
          />

          {error && <div className="error">{error}</div>}

          {submitted ? (
            <div className="success" role="status" aria-live="polite">
              Thanks — comment posted!
            </div>
          ) : (
            <button type="submit" className="submit" disabled={!canSubmit || submitting}>
              {submitting ? "Submitting…" : "Submit comment"}
            </button>
          )}
        </form>
      </section>

      {/* --- Comments stream OUTSIDE the submission card --- */}
      <section className="comments-section" aria-live="polite" aria-busy={loading ? "true" : "false"}>
        <h2 className="comments-title">Comments</h2>

        <div className="comments-filters" role="tablist" aria-label="Filter comments">
          {(["all", "missing-data", "correction", "general"] as Filter[]).map((key) => (
            <button
              key={key}
              className={`chip ${filter === key ? "active" : ""}`}
              onClick={() => setFilter(key)}
              role="tab"
              aria-selected={filter === key}
            >
              {key === "all"
                ? "All"
                : key === "missing-data"
                ? "Missing data"
                : key === "correction"
                ? "Corrections"
                : "General"}
            </button>
          ))}
        </div>

        <div className="comments-list">
          {loading && <div className="info">Loading comments…</div>}
          {!loading && filtered.length === 0 && <div className="info">No comments yet.</div>}

          {!loading &&
            filtered.map((c) => {
              const hasGuestKey = Boolean(localStorage.getItem(`comment_editkey_${c._id}`));
              return (
                <Card
                  key={c._id}
                  item={{ _id: c._id, type: c.type, body: c.body, authorName: c.authorName, createdAt: c.createdAt }}
                  canModerate={canModerate}
                  onApprove={(id) => callAdmin("PATCH", id, "visible")}
                  onHide={(id) => callAdmin("PATCH", id, "hide")}
                  onDelete={(id) => callAdmin("DELETE", id)}
                  canEdit={hasGuestKey}
                  onSaveSelf={saveSelf}
                  onDeleteSelf={deleteSelf}
                />
              );
            })}
        </div>
      </section>
    </>
  );
}