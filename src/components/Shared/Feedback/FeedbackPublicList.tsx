import { useEffect, useMemo, useState } from "react";
import FeedbackCard, { type FeedbackItem } from "@/components/Shared/Feedback/FeedbackCard";

type Mode = "recent" | "all";

type Props = {
  /** Bump this to force a refetch after a successful post */
  refreshKey?: number;
  /** Items to show immediately (e.g., the one you just posted) */
  localItems?: FeedbackItem[];
  /** Which tab/mode to show */
  mode?: Mode;
  /** If the parent already renders a heading, hide this component's title */
  showTitle?: boolean;
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

export default function FeedbackPublicList({
  refreshKey = 0,
  localItems = [],
  mode = "recent",
  showTitle = true,
}: Props) {
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
        // 1) Preferred: public endpoint (server decides “recent” vs “all”)
        let url = `${API_BASE}/api/feedback/public?mode=${mode}`;
        let init: RequestInit | undefined;
        let r = await fetch(url);

        // 2) Fallback for admins if public route isn’t available
        if (r.status === 404) {
          const adminKey = sessionStorage.getItem("feedbackAdminKey") || "";
          if (adminKey) {
            const qs = new URLSearchParams();
            if (mode === "recent") {
              qs.set("status", "new,triaged");
              qs.set("limit", "20");
            } else {
              qs.set("status", "all");
              qs.set("limit", "100");
            }
            url = `${API_BASE}/api/feedback/admin/list?${qs.toString()}`;
            init = { headers: { "x-admin-key": adminKey } };
            r = await fetch(url, init);
          } else {
            if (alive) {
              setNoPublicEndpoint(true);
              setItems([]);
            }
            return;
          }
        }

        const j: unknown = await r.json().catch(() => ({}));
        if (!r.ok || !isOkList(j)) throw new Error(`Failed to load feedback (${r.status})`);

        // newest first (server may already do this)
        const serverItems = [...j.data.items].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        if (alive) setItems(serverItems);
      } catch (e) {
        if (alive) setErr(e instanceof Error ? e.message : "Failed to load feedback.");
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [refreshKey, mode]);

  // merge local just-posted items at the top without duplicates
  const freshIds = new Set(localItems.map((i) => i._id));
  const merged: FeedbackItem[] = [...localItems, ...items.filter((i) => !freshIds.has(i._id))];

  const showNoPublicMsg = noPublicEndpoint && merged.length === 0 && !loading && !err;

  return (
    <section className="feedback-public-list">
      {showTitle && (
        <h2 className="comments-title">
          {mode === "recent" ? "Recent Feedback" : "All Feedback"}
        </h2>
      )}

      {loading && <div className="info">Loading…</div>}
      {err && <div className="error">{err}</div>}
      {showNoPublicMsg && <div className="info">Public feedback listing isn’t available yet.</div>}
      {!loading && !err && !showNoPublicMsg && merged.length === 0 && (
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