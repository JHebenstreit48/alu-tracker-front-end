import { useCallback, useMemo, useState } from "react";

export type CommentCardItem = {
  _id: string;
  type: "missing-data" | "correction" | "general";
  body: string;
  authorName?: string;
  status: "visible" | "pending" | "hidden";
  createdAt: string;
  updatedAt: string;
};

type Props = {
  item: CommentCardItem;
  fmt: Intl.DateTimeFormat;
  showStatus?: boolean;
  showAdminActions?: boolean;
  baseUrl: string;
  onAfter?: () => void;
};

function isObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}
function isOk(v: unknown): v is { ok: true } {
  return isObject(v) && v.ok === true;
}

export default function CommentCard({
  item,
  fmt,
  showStatus = false,
  showAdminActions = false,
  baseUrl,
  onAfter
}: Props) {
  const [busy, setBusy] = useState(false);
  const adminKey = useMemo(() => sessionStorage.getItem("commentsAdminKey") || "", []);

  const call = useCallback(
    async (method: "PATCH" | "DELETE", action?: "visible" | "hide") => {
      if (!showAdminActions || !adminKey) return;
      setBusy(true);
      try {
        const url =
          method === "DELETE"
            ? `${baseUrl}/api/comments/${encodeURIComponent(item._id)}`
            : `${baseUrl}/api/comments/${encodeURIComponent(item._id)}/${action}`;
        const r = await fetch(url, { method, headers: { "x-admin-key": adminKey } });
        const j: unknown = await r.json().catch(() => ({}));
        if (!r.ok || !isOk(j)) throw new Error("Action failed");
        onAfter?.();
      } finally {
        setBusy(false);
      }
    },
    [adminKey, baseUrl, item._id, onAfter, showAdminActions]
  );

  return (
    <article className="comment-card">
      <header className="meta">
        <span className={`tag ${item.type}`}>{item.type.replace("-", " ")}</span>
        <span className="dot">•</span>
        <span className="author">{item.authorName || "Anonymous"}</span>
        <span className="dot">•</span>
        <time dateTime={item.createdAt}>{fmt.format(new Date(item.createdAt))}</time>

        {showStatus && (
          <span className={`status ${item.status}`} title={`Status: ${item.status}`}>
            {item.status}
          </span>
        )}

        {showAdminActions && (
          <span className="icon-actions" aria-label="Moderation">
            <button
              type="button"
              className="icon-btn"
              title="Approve (visible)"
              disabled={busy}
              onClick={() => void call("PATCH", "visible")}
              aria-label="Approve"
            >
              {/* check-circle */}
              <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                <path d="M12 2a10 10 0 1 0 .001 20.001A10 10 0 0 0 12 2Zm-1 14-4-4 1.4-1.4L11 12.2l5.6-5.6L18 8l-7 8Z"/>
              </svg>
            </button>

            <button
              type="button"
              className="icon-btn"
              title="Hide"
              disabled={busy}
              onClick={() => void call("PATCH", "hide")}
              aria-label="Hide"
            >
              {/* eye-off */}
              <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                <path d="M2 4.27 3.28 3l18 18L20.73 22l-3.14-3.14A10.7 10.7 0 0 1 12 20C6 20 2 12 2 12a19.2 19.2 0 0 1 4.12-5.56L2 4.27Zm7.1 7.1 3.53 3.53A4 4 0 0 1 9.1 11.37ZM12 6c6 0 10 8 10 8a19.8 19.8 0 0 1-3.07 4.16l-2.18-2.18A10.7 10.7 0 0 0 22 12s-4-8-10-8a10.7 10.7 0 0 0-5.98 2.1l2.2 2.2A4 4 0 0 1 12 8c2.2 0 4 1.8 4 4 0 .6-.14 1.16-.38 1.67l-1.46-1.46A2 2 0 0 0 12 10c-.3 0-.58.06-.84.17L9.4 8.4A6 6 0 0 1 12 6Z"/>
              </svg>
            </button>

            <button
              type="button"
              className="icon-btn danger"
              title="Delete"
              disabled={busy}
              onClick={() => void call("DELETE")}
              aria-label="Delete"
            >
              {/* trash */}
              <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                <path d="M9 3h6l1 1h4v2H4V4h4l1-1Zm1 6h2v8h-2V9Zm4 0h2v8h-2V9ZM6 9h2v8H6V9Zm-1 11h14v2H5v-2Z"/>
              </svg>
            </button>
          </span>
        )}
      </header>

      <p className="body">{item.body}</p>
    </article>
  );
}