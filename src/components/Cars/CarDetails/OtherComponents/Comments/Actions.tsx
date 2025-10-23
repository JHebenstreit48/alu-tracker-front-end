import { useState } from "react";

type Props = {
  id: string;
  baseUrl: string;
  onAfter?: () => void;
};

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}
function isOk(v: unknown): v is { ok: true } {
  return isRecord(v) && v.ok === true;
}

export default function CommentActions({ id, baseUrl, onAfter }: Props) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const adminKey = sessionStorage.getItem("commentsAdminKey") || "";

  if (!adminKey) return null;

  async function call(method: "PATCH" | "DELETE", action?: "visible" | "hide") {
    setBusy(true);
    setErr(null);
    try {
      const url =
        method === "DELETE"
          ? `${baseUrl}/api/comments/${encodeURIComponent(id)}`
          : `${baseUrl}/api/comments/${encodeURIComponent(id)}/${action}`;

      const r = await fetch(url, { method, headers: { "x-admin-key": adminKey } });
      const j: unknown = await r.json().catch(() => ({}));

      if (!r.ok || !isOk(j)) {
        throw new Error(`Admin action failed (${r.status})`);
      }
      onAfter?.();
    } catch (e) {
      const m = e instanceof Error ? e.message : "Admin action failed";
      setErr(m);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="admin-actions" style={{ display: "flex", gap: "0.4rem", marginTop: "0.4rem" }}>
      <button disabled={busy} onClick={() => call("PATCH", "visible")}>Approve</button>
      <button disabled={busy} onClick={() => call("PATCH", "hide")}>Hide</button>
      <button disabled={busy} onClick={() => call("DELETE")}>Delete</button>
      {err && <div className="error" style={{ marginLeft: ".5rem" }}>{err}</div>}
    </div>
  );
}