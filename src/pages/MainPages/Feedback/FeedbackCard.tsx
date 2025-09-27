import React from "react";

export type FeedbackStatus = "new" | "triaged" | "closed";
export type FeedbackCategory = "bug" | "feature" | "content" | "other";

export type FeedbackItem = {
  _id: string;
  category: FeedbackCategory;
  message: string;
  email?: string;
  pageUrl?: string;
  status: FeedbackStatus;
  createdAt: string; // ISO string
};

type Props = {
  item: FeedbackItem;
  fmt?: Intl.DateTimeFormat;
  showAdminActions?: boolean;
  onTriaged?: (id: string) => void;
  onClosed?: (id: string) => void;
  onDelete?: (id: string) => void;
};

export default function FeedbackCard({
  item,
  fmt,
  showAdminActions = false,
  onTriaged,
  onClosed,
  onDelete,
}: Props) {
  const formatter =
    fmt || new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" });

  return (
    <article className="feedback-card">
      <header className="feedback-meta">
        <span className="cat">{item.category}</span>
        <span className="dot">•</span>
        <time dateTime={item.createdAt}>{formatter.format(new Date(item.createdAt))}</time>
        {item.status !== "new" && (
          <>
            <span className="dot">•</span>
            <span className={`status ${item.status}`}>{item.status}</span>
          </>
        )}
      </header>

      <p className="feedback-body">{item.message}</p>

      <div className="feedback-extra">
        {item.email && <span className="email">{item.email}</span>}
        {item.pageUrl && (
          <a href={item.pageUrl} target="_blank" rel="noreferrer">
            View page
          </a>
        )}
      </div>

      {showAdminActions && (
        <div className="admin-actions" style={{ display: "flex", gap: "0.4rem", marginTop: ".5rem" }}>
          <button type="button" onClick={() => onTriaged?.(item._id)}>Mark triaged</button>
          <button type="button" onClick={() => onClosed?.(item._id)}>Close</button>
          <button type="button" onClick={() => onDelete?.(item._id)}>Delete</button>
        </div>
      )}
    </article>
  );
}