import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/components/SignupLogin/hooks/useAuth";
import { generateCarKey } from "@/components/CarInformation/CarDetails/Miscellaneous/StorageUtils";
import CommentKey from "@/components/CarInformation/CarDetails/OtherComponents/Comments/CommentKey";
import CommentCard, { CommentCardItem } from "@/components/CarInformation/CarDetails/OtherComponents/Comments/CommentCard";
import "@/scss/Cars/CarComments.scss";

type CommentType = "missing-data" | "correction" | "general";
type Filter = "all" | CommentType;

type CommentItem = CommentCardItem & {
  normalizedKey: string;
  brand?: string;
  model?: string;
};

type CommentsPublicData = { comments: CommentItem[] };
type OkPublic = { ok: true; data: CommentsPublicData };
type OkAdminList = { ok: true; data: { items: CommentItem[] } };

interface Props {
  normalizedKey: string;
  brand?: string;
  model?: string;
}

const COMMENTS_BASE =
  import.meta.env.VITE_COMMENTS_API_BASE_URL?.replace(/\/+$/, "") ||
  "http://127.0.0.1:3004";

/* helpers */
function isObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}
function isOkPublic(v: unknown): v is OkPublic {
  return (
    isObject(v) &&
    v.ok === true &&
    isObject(v.data) &&
    Array.isArray((v.data as Record<string, unknown>).comments)
  );
}
function isOkAdminList(v: unknown): v is OkAdminList {
  return (
    isObject(v) &&
    v.ok === true &&
    isObject(v.data) &&
    Array.isArray((v.data as Record<string, unknown>).items)
  );
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

  const keyForApi = useMemo(() => {
    if (brand && model) return generateCarKey(brand, model);
    return normalizedKey;
  }, [brand, model, normalizedKey]);

  const [adminKey, setAdminKey] = useState<string>(() => sessionStorage.getItem("commentsAdminKey") || "");
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

  const fetchList = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (adminKey) {
        const qs = new URLSearchParams({ slug: keyForApi, limit: "200" });
        const r = await fetch(`${COMMENTS_BASE}/api/comments/admin/list?${qs.toString()}`, {
          headers: { "x-admin-key": adminKey }
        });
        const j: unknown = await r.json().catch(() => ({}));
        if (!r.ok || !isOkAdminList(j)) throw new Error(`Failed to load comments (${r.status})`);
        setComments(j.data.items);
      } else {
        const r = await fetch(`${COMMENTS_BASE}/api/comments/${encodeURIComponent(keyForApi)}`);
        const j: unknown = await r.json().catch(() => ({}));
        if (!r.ok || !isOkPublic(j)) throw new Error(`Failed to load comments (${r.status})`);
        setComments(j.data.comments);
      }
    } catch (e: unknown) {
      setError(getErrorMessage(e));
    } finally {
      setLoading(false);
    }
  }, [adminKey, keyForApi]);

  useEffect(() => { void fetchList(); }, [fetchList]);

  useEffect(() => { localStorage.setItem("commentAuthorName", authorName); }, [authorName]);
  useEffect(() => { localStorage.setItem("commentAuthorEmail", authorEmail); }, [authorEmail]);

  const filtered = useMemo(() => {
    if (filter === "all") return comments;
    return comments.filter((c) => c.type === filter);
  }, [comments, filter]);

  const remaining = maxLen - body.length;
  const canSubmit = body.trim().length >= 5 && body.length <= maxLen;

  const fmt = useMemo(
    () => new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }),
    []
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit || submitting) return;

    setSubmitting(true);
    setError(null);

    const ac = new AbortController();
    const timer = window.setTimeout(() => ac.abort(), 20000);

    try {
      const headers: HeadersInit = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const payload = {
        normalizedKey: keyForApi,
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
        body: JSON.stringify(payload),
        signal: ac.signal
      });

      let ok = false;
      try {
        const j: unknown = await r.clone().json();
        ok = isObject(j) && j.ok === true;
      } catch { ok = false; }
      if (!r.ok || !ok) {
        const txt = await r.text().catch(() => "");
        throw new Error(txt || `Failed to submit comment (${r.status})`);
      }

      setSubmitted(true);
      setBody("");
      setType("general");
      await fetchList();
    } catch (e: unknown) {
      setError(getErrorMessage(e));
    } finally {
      window.clearTimeout(timer);
      setSubmitting(false);
    }
  }

  return (
    <>
      {/* Divider above the submit box */}
      <div className="comments-divider" aria-hidden="true" />

      {/* Submit box (keeps your original .comments-panel styles) */}
      <section className="comments-panel">
        <h2 className="comments-title">Comments</h2>

        {/* Admin key input (only reveals moderation controls when filled) */}
        <CommentKey onChange={setAdminKey} />

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
              {key === "all" ? "All" : key === "missing-data" ? "Missing data" : key === "correction" ? "Corrections" : "General"}
            </button>
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
              Thanks — your comment was received{adminKey ? "" : " and will appear after review"}.
            </div>
          ) : (
            <button type="submit" className="submit" disabled={!canSubmit || submitting}>
              {submitting ? "Submitting…" : "Submit comment"}
            </button>
          )}
        </form>
      </section>

      {/* Separate stream box below; scrollable with overflow hiding */}
      <section className="comments-streamBox">
        <h3 className="stream-title">Recent comments</h3>

        <div className="comments-scroll">
          {loading && <div className="info">Loading comments…</div>}
          {!loading && filtered.length === 0 && <div className="info">No comments yet.</div>}

          {!loading &&
            filtered.map((c) => (
              <CommentCard
                key={c._id}
                item={c}
                fmt={fmt}
                showStatus={!!adminKey}          // show visibility chip in admin mode
                showAdminActions={!!adminKey}     // icon actions for testing (admin key present)
                baseUrl={COMMENTS_BASE}
                onAfter={fetchList}
              />
            ))}
        </div>
      </section>
    </>
  );
}