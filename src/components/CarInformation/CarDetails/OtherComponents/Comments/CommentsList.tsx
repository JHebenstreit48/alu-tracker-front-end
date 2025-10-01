import Card from "@/components/CarInformation/CarDetails/OtherComponents/Comments/Card";
import type { Filter, CommentItem } from "@/components/CarInformation/CarDetails/OtherComponents/Comments/types";

type Props = {
  loading: boolean;
  items: CommentItem[];
  filter: Filter;
  setFilter: (f: Filter) => void;
  canModerate: boolean;
  onApprove: (id: string) => void;
  onHide: (id: string) => void;
  onDelete: (id: string) => void;
  onSaveSelf: (id: string, body: string) => Promise<void>;
  onDeleteSelf: (id: string) => Promise<void>;
};

export default function CommentsList({
  loading, items, filter, setFilter, canModerate,
  onApprove, onHide, onDelete, onSaveSelf, onDeleteSelf
}: Props) {
  return (
    <section className="comments-section" aria-live="polite" aria-busy={loading ? "true" : "false"}>
      <h2 className="comments-title">Comments</h2>

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

      <div className="comments-list">
        {loading && <div className="info">Loading comments…</div>}
        {!loading && items.length === 0 && <div className="info">No comments yet.</div>}
        {!loading && items.map((c) => {
          const hasGuestKey = Boolean(localStorage.getItem(`comment_editkey_${c._id}`));
          return (
            <Card
              key={c._id}
              item={{ _id: c._id, type: c.type, body: c.body, authorName: c.authorName, createdAt: c.createdAt }}
              canModerate={canModerate}
              onApprove={onApprove}
              onHide={onHide}
              onDelete={onDelete}
              canEdit={hasGuestKey}
              onSaveSelf={onSaveSelf}
              onDeleteSelf={onDeleteSelf}
            />
          );
        })}
      </div>
    </section>
  );
}