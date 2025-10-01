import { useEffect, useMemo, useState } from "react";
import FeedbackCard, { type FeedbackItem } from "@/components/Shared/Feedback/FeedbackCard";

type Props = {
  /** Bump this to force a refetch after a successful post */
  refreshKey?: number;
  /** Items to show immediately (e.g., the one you just posted) */
  localItems?: FeedbackItem[];
};

const API_BASE =
  import.meta.env.VITE_COMMENTS_API_BASE_URL?.replace(/\/+$/, "") ??
  (import.meta.env.DEV ? "http://127.0.0.1:3004" : "");

type OkList = { ok: true; data: { items: FeedbackItem[] } };

function isObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}
function hasItemsBlock(v: unknown): v is { items: FeedbackItem[] } {
  return isObject(v) && Array.isArray((v as Record<string, unknown>).items);
}
function isOkList(v: unknown): v is OkList {
  return isObject(v) && v.ok === true && isObject(v.data) && hasItemsBlock(v.data);
}

export default function FeedbackPublicList({ refreshKey = 0, localItems = [] }: Props) {
  const [items, setItems] = useState<FeedbackItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [noPublicEndpoint, setNoPublicEndpoint] = useState(false);

  const fmt = useMemo(
    () => new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }),
    []
  );

  useEffect(() => {
    let alive = true;

    (async () => {
      if (!API_BASE) return;
      setLoading(true);
      setErr(null);
      setNoPublicEndpoint(false);

      try {
        // Preferred future route
        let url = `${API_BASE}/api/feedback/public?status=triaged`;
        let init: RequestInit | undefined;
        let r = await fetch(url);

        // Fallback: admin list if an admin key exists
        if (r.status === 404) {
          const adminKey = sessionStorage.getItem("feedbackAdminKey") || "";
          if (adminKey) {
            url = `${API_BASE}/api/feedback/admin/list?status=triaged`;
            init = { headers: { "x-admin-key": adminKey } };
            r = await fetch(url, init);
          } else {
            if (alive) {
              setNoPublicEndpoint(true);
              setItems([]);
            }
            return; // No public listing available
          }
        }

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
  }, [refreshKey]);

  // Show freshly posted items immediately (local) above server items
  const merged = localItems.concat(items);

  return (
    <section className="feedback-public-list" style={{ marginBottom: "1.25rem" }}>
      <h2 className="comments-title">Recent Feedback</h2>
      {loading && <div className="info">Loading…</div>}
      {err && <div className="error">{err}</div>}
      {!loading && noPublicEndpoint && (
        <div className="info">Public feedback listing isn’t available yet.</div>
      )}
      {!loading && !err && !noPublicEndpoint && merged.length === 0 && (
        <div className="info">No feedback yet.</div>
      )}

      <div className="feedback-list">
        {merged.map((fb) => (
          <FeedbackCard key={fb._id} item={fb} fmt={fmt} />
        ))}
      </div>
    </section>
  );
}