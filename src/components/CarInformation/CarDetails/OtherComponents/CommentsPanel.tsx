import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/components/SignupLogin/hooks/useAuth";
import "@/scss/Cars/CarComments.scss";

type CommentType = "missing-data" | "correction" | "general";
type Filter = "all" | CommentType;

type CommentItem = {
  _id: string;
  normalizedKey: string;
  brand?: string;
  model?: string;
  type: CommentType;
  body: string;
  authorName?: string;
  status: "visible" | "pending" | "hidden";
  createdAt: string;
  updatedAt: string;
};

type ErrorPayload = { code: string; message: string; details?: unknown };
type CommentsListData = { comments: CommentItem[] };
type ApiOk<T> = { ok: true; data: T };
type ApiErr = { ok: false; error: ErrorPayload };
type ApiResponse<T> = ApiOk<T> | ApiErr;

interface Props {
  normalizedKey: string;
  brand?: string;
  model?: string;
}

const COMMENTS_BASE =
  import.meta.env.VITE_COMMENTS_API_BASE_URL?.replace(/\/+$/, "") ||
  "http://127.0.0.1:3004";

// ---------- tiny helpers (no-any) ----------
function isObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}
function isApiResponseComments(v: unknown): v is ApiResponse<CommentsListData> {
  if (!isObject(v) || typeof v.ok !== "boolean") return false;
  if (v.ok === true) {
    if (!("data" in v) || !isObject(v.data)) return false;
    const data = v.data as Record<string, unknown>;
    return Array.isArray(data.comments);
  }
  // error branch
  if (!("error" in v) || !isObject(v.error)) return false;
  const err = v.error as Record<string, unknown>;
  return typeof err.message === "string";
}
function getErrorMessage(e: unknown): string {
  if (e instanceof Error) return e.message;
  if (isObject(e) && typeof e.message === "string") return e.message;
  return "Unexpected error";
}

export default function CommentsPanel({ normalizedKey, brand, model }: Props) {
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
  const [authorName, setAuthorName] = useState(
    localStorage.getItem("commentAuthorName") || ""
  );
  const [authorEmail, setAuthorEmail] = useState(
    localStorage.getItem("commentAuthorEmail") || ""
  );
  const [hp, setHp] = useState(""); // honeypot
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const maxLen = 2000;

  // load comments
  useEffect(() => {
    let live = true;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const r = await fetch(
          `${COMMENTS_BASE}/api/comments/${encodeURIComponent(normalizedKey)}`
        );
        const j: unknown = await r.json();
        if (!live) return;
        if (isApiResponseComments(j) && j.ok) {
          setComments(j.data.comments);
        } else {
          setError("Failed to load comments.");
        }
      } catch (e: unknown) {
        if (live) setError(getErrorMessage(e));
      } finally {
        if (live) setLoading(false);
      }
    })();
    return () => {
      live = false;
    };
  }, [normalizedKey]);

  // persist convenience fields
  useEffect(() => {
    localStorage.setItem("commentAuthorName", authorName);
  }, [authorName]);

  useEffect(() => {
    localStorage.setItem("commentAuthorEmail", authorEmail);
  }, [authorEmail]);

  const filtered = useMemo(() => {
    if (filter === "all") return comments;
    return comments.filter((c) => c.type === filter);
  }, [comments, filter]);

  const remaining = maxLen - body.length;
  const canSubmit = body.trim().length >= 5 && body.length <= maxLen;

  const fmt = new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short"
  });

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

      const j: unknown = await r.json();
      // success payload is simply { ok: true }
      if (!r.ok || !isObject(j) || j.ok !== true) {
        const msg =
          (isObject(j) &&
            isObject(j.error) &&
            typeof j.error.message === "string" &&
            j.error.message) ||
          "Failed to submit comment.";
        throw new Error(msg);
      }

      setSubmitted(true);
      setBody("");
      setType("general");
      // don't append locally; item may be pending until approved
    } catch (e: unknown) {
      setError(getErrorMessage(e));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="comments-panel">
      <h2 className="comments-title">Comments</h2>

      {/* Filters */}
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

      {/* List */}
      <div className="comments-list">
        {loading && <div className="info">Loading comments…</div>}
        {!loading && filtered.length === 0 && (
          <div className="info">No comments yet.</div>
        )}

        {!loading &&
          filtered.map((c) => (
            <article key={c._id} className="comment">
              <header className="meta">
                <span className={`tag ${c.type}`}>{c.type.replace("-", " ")}</span>
                <span className="dot">•</span>
                <span className="author">{c.authorName || "Anonymous"}</span>
                <span className="dot">•</span>
                <time dateTime={c.createdAt}>{fmt.format(new Date(c.createdAt))}</time>
              </header>
              <p className="body">{c.body}</p>
            </article>
          ))}
      </div>

      {/* Form */}
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
          <div className="success">
            Thanks — your comment was received and will appear after review.
          </div>
        ) : (
          <button type="submit" className="submit" disabled={!canSubmit || submitting}>
            {submitting ? "Submitting…" : "Submit comment"}
          </button>
        )}
      </form>
    </section>
  );
}