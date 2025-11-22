import type { CarStatus } from "@/types/shared/status";

type Props = {
  updatedAt?: string;          // ISO string (UTC)
  status?: CarStatus | null;
  inline?: boolean;            // NEW: render chip+message and timestamp on one row
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

export default function CarDataStatusCard({ updatedAt, status, inline = false }: Props) {
  const formatted = formatDateTimeLocal(updatedAt);

  return (
    <div className={`car-status-card${inline ? " is-inline" : ""}`}>
      {status ? (
        <div className="status-row">
          <span className={`chip chip--${status.status.replace(" ", "-")}`}>
            {status.status}
          </span>
          {status.message ? <span className="msg">— {status.message}</span> : null}
        </div>
      ) : null}

      <div className="updated">
        <span className="label">Last updated:</span>
        <time dateTime={updatedAt}>{formatted}</time>
      </div>
    </div>
  );
}