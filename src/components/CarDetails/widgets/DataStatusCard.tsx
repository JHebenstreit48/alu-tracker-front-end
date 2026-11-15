import type { CarStatus } from "@/types/shared/status";

type Props = {
  updatedAt?: string;
  status?: CarStatus | null;
  inline?: boolean;
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

const STATUS_LABELS: Record<CarStatus["status"], string> = {
  "complete":     "Complete",
  "in progress":  "In Progress",
  "coming soon":  "Coming Soon",
  "missing":      "Missing",
  "unknown":      "Unknown",
};

export default function CarDataStatusCard({ updatedAt, status, inline = false }: Props) {
  const formatted = formatDateTimeLocal(updatedAt);
  const label = status ? (STATUS_LABELS[status.status] ?? status.status) : null;
  const chipClass = status ? `chip chip--${status.status.replaceAll(" ", "-")}` : "";

  return (
    <div className={`car-status-card${inline ? " is-inline" : ""}`}>
      {status ? (
        <div className="status-row">
          <span className={chipClass}>
            {label}
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