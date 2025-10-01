import { useEffect, useMemo, useState } from "react";

// same base logic as the form — keep it consistent
const API_BASE =
  import.meta.env.VITE_COMMENTS_API_BASE_URL?.replace(/\/+$/, "") ??
  (import.meta.env.DEV ? "http://127.0.0.1:3004" : "");

export type PublicFeedbackItem = {
  _id: string;
  category: "bug" | "feature" | "content" | "other";
  message: string;
  email?: string;
  pageUrl?: string;
  status: "new" | "triaged" | "closed";
  createdAt: string;
};

type OkList = { ok: true; data: { items: PublicFeedbackItem[] } };

function isObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}
function isOkList(v: unknown): v is OkList {
  return (
    isObject(v) &&
    v.ok === true &&
    isObject(v.data) &&
    Array.isArray((v.data as Record<string, unknown>).items)
  );
}

export default function FeedbackList() {
  const [items, setItems] = useState<PublicFeedbackItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const fmt = useMemo(
    () => new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }),
    []
  );

  useEffect(() => {
    let alive = true;
    (async () => {
      if (!API_BASE) return; // prod safety
      setLoading(true);
      setErr(null);
      try {
        // Use a dedicated public endpoint you expose from the comments/feedback API.
        // If you only have one list endpoint, you can filter by status here or on the server.
        const r = await fetch(`${API_BASE}/api/feedback/public?status=triaged`);
        const j: unknown = await r.json().catch(() => ({}));
        if (!r.ok || !isOkList(j)) throw new Error(`Failed to load feedback (${r.status})`);
        if (alive) setItems(j.data.items);
      } catch (e) {
        if (alive) setErr(e instanceof Error ? e.message : "Failed to load feedback.");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  return (
    <section className="feedback-list-wrap" style={{ marginBottom: "1.25rem" }}>
      <h2 className="comments-title">Recent Feedback</h2>
      {loading && <div className="info">Loading…</div>}
      {err && <div className="error">{err}</div>}
      {!loading && !err && items.length === 0 && (
        <div className="info">No feedback yet.</div>
      )}
      <div className="feedback-list" style={{ display: "grid", gap: ".6rem" }}>
        {items.map((fb) => (
          <article
            key={fb._id}
            className={`feedback-item status-${fb.status}`}
            style={{ border: "1px solid #444", borderRadius: "12px", padding: ".75rem" }}
          >
            <header style={{ display: "flex", justifyContent: "space-between", gap: ".5rem" }}>
              <strong style={{ textTransform: "capitalize" }}>{fb.category}</strong>
              <span title={fb.createdAt}>{fmt.format(new Date(fb.createdAt))}</span>
            </header>
            <p style={{ marginTop: ".35rem", whiteSpace: "pre-wrap" }}>{fb.message}</p>
            {fb.pageUrl && (
              <a href={fb.pageUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: ".9em" }}>
                View context
              </a>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}