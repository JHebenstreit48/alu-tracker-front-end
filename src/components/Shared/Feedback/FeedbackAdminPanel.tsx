import { useCallback, useEffect, useMemo, useState } from "react";
import FeedbackCard, { FeedbackItem, FeedbackStatus } from "@/components/Shared/Feedback/FeedbackCard";

const API_BASE =
  import.meta.env.VITE_COMMENTS_API_BASE_URL?.replace(/\/+$/, "") ??
  (import.meta.env.DEV ? "http://127.0.0.1:3004" : "");

type OkList = { ok: true; data: { items: FeedbackItem[] } };
type Ok = { ok: true };

function isObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}
function isOkList(v: unknown): v is OkList {
  return isObject(v) && v.ok === true && isObject(v.data) && Array.isArray((v.data as Record<string, unknown>).items);
}
function isOk(v: unknown): v is Ok {
  return isObject(v) && v.ok === true;
}
function getErrorMessage(e: unknown): string {
  if (e instanceof Error) return e.message;
  if (isObject(e) && typeof e.message === "string") return e.message;
  return "Unexpected error";
}

export default function FeedbackAdminPanel() {
  const [adminKey, setAdminKey] = useState<string>(() => sessionStorage.getItem("feedbackAdminKey") || "");
  const [statusFilter, setStatusFilter] = useState<FeedbackStatus | "all">("new");
  const [items, setItems] = useState<FeedbackItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (adminKey) sessionStorage.setItem("feedbackAdminKey", adminKey);
    else sessionStorage.removeItem("feedbackAdminKey");
  }, [adminKey]);

  const fmt = useMemo(
    () => new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }),
    []
  );

  const load = useCallback(async () => {
    if (!adminKey) return;
    setLoading(true);
    setErr(null);
    try {
      const qs = new URLSearchParams();
      if (statusFilter !== "all") qs.set("status", statusFilter);
      const r = await fetch(`${API_BASE}/api/feedback/admin/list?${qs.toString()}`, {
        headers: { "x-admin-key": adminKey }
      });
      const j: unknown = await r.json().catch(() => ({}));
      if (!r.ok || !isOkList(j)) throw new Error(`Failed to load feedback (${r.status})`);
      setItems(j.data.items);
    } catch (e: unknown) {
      setErr(getErrorMessage(e));
    } finally {
      setLoading(false);
    }
  }, [adminKey, statusFilter]);

  useEffect(() => {
    void load();
  }, [load]);

  const patchStatus = useCallback(async (id: string, status: FeedbackStatus) => {
    if (!adminKey) return;
    try {
      const r = await fetch(`${API_BASE}/api/feedback/${encodeURIComponent(id)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "x-admin-key": adminKey },
        body: JSON.stringify({ status })
      });
      const j: unknown = await r.json().catch(() => ({}));
      if (!r.ok || !isOk(j)) throw new Error(`Failed to update (${r.status})`);
      void load();
    } catch (e: unknown) {
      setErr(getErrorMessage(e));
    }
  }, [adminKey, load]);

  const del = useCallback(async (id: string) => {
    if (!adminKey) return;
    try {
      const r = await fetch(`${API_BASE}/api/feedback/${encodeURIComponent(id)}`, {
        method: "DELETE",
        headers: { "x-admin-key": adminKey }
      });
      const j: unknown = await r.json().catch(() => ({}));
      if (!r.ok || !isOk(j)) throw new Error(`Failed to delete (${r.status})`);
      void load();
    } catch (e: unknown) {
      setErr(getErrorMessage(e));
    }
  }, [adminKey, load]);

  // Hide admin list if no key is present — only show the small key control.
  return (
    <section className="feedback-admin-panel" style={{ marginTop: "1rem" }}>
      <div className="feedback-admin-key" style={{ display: "flex", gap: "0.5rem", alignItems: "center", marginBottom: ".75rem" }}>
        <label htmlFor="feedback-admin-key">Admin key</label>
        <input
          id="feedback-admin-key"
          type="password"
          value={adminKey}
          onChange={(e) => setAdminKey(e.target.value)}
          placeholder="Enter FEEDBACK_ADMIN_KEY"
          style={{ maxWidth: 260 }}
        />
        {!!adminKey && <button type="button" onClick={() => setAdminKey("")}>Clear</button>}
      </div>

      {!adminKey ? null : (
        <>
          <div className="feedback-admin-toolbar" style={{ display: "flex", gap: ".5rem", alignItems: "center", marginBottom: ".75rem" }}>
            <span>Status:</span>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as FeedbackStatus | "all")}>
              <option value="new">New</option>
              <option value="triaged">Triaged</option>
              <option value="closed">Closed</option>
              <option value="all">All</option>
            </select>
            <button type="button" onClick={() => void load()}>Refresh</button>
          </div>

          {err && <div className="error" style={{ marginBottom: ".5rem" }}>{err}</div>}
          {loading && <div className="info">Loading…</div>}
          {!loading && items.length === 0 && <div className="info">No feedback found.</div>}

          <div className="feedback-list" style={{ display: "grid", gap: ".6rem" }}>
            {items.map((fb) => (
              <FeedbackCard
                key={fb._id}
                item={fb}
                fmt={fmt}
                showAdminActions
                onTriaged={(id) => void patchStatus(id, "triaged")}
                onClosed={(id) => void patchStatus(id, "closed")}
                onDelete={(id) => void del(id)}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}