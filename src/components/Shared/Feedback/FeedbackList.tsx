import { usePublicFeedback } from "@/hooks/Feedback/usePublicFeedback";

export default function FeedbackList() {
  const { items, loading, error, fmt } = usePublicFeedback();

  return (
    <section className="feedback-list-wrap" style={{ marginBottom: "1.25rem" }}>
      <h2 className="comments-title">Recent Feedback</h2>

      {loading && <div className="info">Loading…</div>}
      {error && <div className="error">{error}</div>}
      {!loading && !error && items.length === 0 && (
        <div className="info">No feedback yet.</div>
      )}

      <div className="feedback-list" style={{ display: "grid", gap: ".6rem" }}>
        {items.map((fb) => (
          <article
            key={fb._id}
            className={`feedback-item status-${fb.status}`}
            style={{
              border: "1px solid #444",
              borderRadius: "12px",
              padding: ".75rem",
            }}
          >
            <header
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: ".5rem",
              }}
            >
              <strong style={{ textTransform: "capitalize" }}>
                {fb.category}
              </strong>
              <span title={fb.createdAt}>
                {fmt.format(new Date(fb.createdAt))}
              </span>
            </header>
            <p
              style={{
                marginTop: ".35rem",
                whiteSpace: "pre-wrap",
              }}
            >
              {fb.message}
            </p>
            {fb.pageUrl && (
              <a
                href={fb.pageUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontSize: ".9em" }}
              >
                View context
              </a>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}