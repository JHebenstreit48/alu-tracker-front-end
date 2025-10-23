import type { ApiStatusDoc, CarStatus } from "@/components/Cars/CarDetails/types";

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
  const s = toCarStatus(doc.status);
  return s
    ? {
        status: s,
        message: doc.message,
        lastChecked: doc.updatedAt ?? doc.createdAt ?? null,
      }
    : null;
}