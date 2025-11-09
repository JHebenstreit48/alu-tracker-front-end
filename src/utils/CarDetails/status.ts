import type {
  ApiStatusDoc,
  CarStatus,
  FirestoreTimestampJson,
} from "@/types/CarDetails";

function isFirestoreTimestampJson(
  value: unknown
): value is FirestoreTimestampJson {
  return (
    typeof value === "object" &&
    value !== null &&
    "_seconds" in value &&
    "_nanoseconds" in value &&
    typeof (value as { _seconds: unknown })._seconds === "number" &&
    typeof (value as { _nanoseconds: unknown })._nanoseconds === "number"
  );
}

function toIsoString(
  value?: string | FirestoreTimestampJson
): string | null {
  if (!value) return null;

  if (typeof value === "string") {
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? null : d.toISOString();
  }

  if (isFirestoreTimestampJson(value)) {
    const d = new Date(value._seconds * 1000);
    return Number.isNaN(d.getTime()) ? null : d.toISOString();
  }

  return null;
}

export function toCarStatus(value: string): CarStatus["status"] | null {
  switch (value) {
    case "complete":
    case "in progress":
    case "missing":
    case "unknown":
      return value;
    default:
      return null;
  }
}

export function mapApiStatus(doc: ApiStatusDoc | null): CarStatus | null {
  if (!doc) return null;

  const status = toCarStatus(doc.status);
  if (!status) return null;

  const lastChecked =
    toIsoString(doc.updatedAt) ?? toIsoString(doc.createdAt);

  return {
    status,
    message: doc.message,
    lastChecked,
  };
}