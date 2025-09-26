// DataStatusCard.tsx
type CarStatus = {
    status: "complete" | "in progress" | "missing" | "unknown";
    message?: string;
    lastChecked?: string | null;
  };
  
  type Props = {
    updatedAt?: string;         // ISO string from server (UTC)
    status?: CarStatus | null;
  };
  
  const formatDateTimeLocal = (iso?: string) => {
    if (!iso) return "Unknown";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "Unknown";
    return new Intl.DateTimeFormat(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(d);
  };
  
  export default function CarDataStatusCard({ updatedAt, status }: Props) {
    const formatted = formatDateTimeLocal(updatedAt);
  
    return (
      <div className="car-status-card">
        <div className="updated">
          <span className="label">Last updated:</span>
          <time dateTime={updatedAt}>{formatted}</time>
        </div>
  
        {status ? (
          <div className="status-row">
            <span className={`chip chip--${status.status.replace(" ", "-")}`}>
              {status.status}
            </span>
            {status.message ? <span className="msg">— {status.message}</span> : null}
          </div>
        ) : null}
      </div>
    );
  }  