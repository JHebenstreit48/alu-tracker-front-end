import { useMemo } from "react";
import OwnerControls from "@/components/CarDetails/Comments/OwnerControls";

export type CommentCardItem = {
  _id: string;
  type: "missing-data" | "correction" | "general";
  body: string;
  authorName?: string;
  createdAt: string; // ISO
};

type Props = {
  item: CommentCardItem;

  /** admin-only actions (approve/hide/delete) */
  canModerate: boolean;
  onApprove?: (id: string) => void;
  onHide?: (id: string) => void;
  onDelete?: (id: string) => void;

  /** self actions (guest via editKey) */
  canEdit?: boolean;
  onSaveSelf?: (id: string, body: string) => Promise<void>;
  onDeleteSelf?: (id: string) => Promise<void>;
};

export default function CommentCard({
  item,
  canModerate,
  onApprove,
  onHide,
  onDelete,
  canEdit = false,
  onSaveSelf,
  onDeleteSelf
}: Props) {
  const fmt = useMemo(
    () =>
      new Intl.DateTimeFormat(undefined, {
        dateStyle: "medium",
        timeStyle: "short"
      }),
    []
  );

  return (
    <article className="comment" aria-label="Comment">
      <header className="meta">
        <span className={`tag ${item.type}`}>{item.type.replace("-", " ")}</span>
        <span className="dot">•</span>
        <span className="author">{item.authorName || "Anonymous"}</span>
        <span className="dot">•</span>
        <time dateTime={item.createdAt}>{fmt.format(new Date(item.createdAt))}</time>
      </header>

      <p className="body">{item.body}</p>

      {/* Owner controls — only if allowed and handlers provided */}
      {canEdit && onSaveSelf && onDeleteSelf && (
        <OwnerControls
          id={item._id}
          initialBody={item.body}
          onSave={onSaveSelf}
          onDelete={onDeleteSelf}
        />
      )}

      {/* Moderator controls (unchanged) */}
      {canModerate && (
        <div
          className="comment-actions"
          aria-label="Moderator actions"
          style={{ display: "flex", gap: "0.4rem", marginTop: "0.4rem" }}
        >
          <button type="button" title="Approve (visible)" onClick={() => onApprove?.(item._id)}>
            ✅
          </button>
          <button type="button" title="Hide" onClick={() => onHide?.(item._id)}>
            🙈
          </button>
          <button type="button" title="Delete" onClick={() => onDelete?.(item._id)}>
            🗑️
          </button>
        </div>
      )}
    </article>
  );
}