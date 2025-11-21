import { doc, getDoc, type Timestamp } from "firebase/firestore";
import { dbTracker } from "@/Firebase/client";

import type { FullCar } from "@/types/shared/car";
import type { CarStatus, ApiStatusDoc } from "@/types/shared/status";
import { mapApiStatus } from "@/utils/CarDetails/status";
import { getCarImageUrl } from "@/utils/shared/imageUrl";

/**
 * Fetch a single car by slug (normalizedKey) from Firestore.
 * Slug is expected to match the document ID in `cars` (normalizedKey).
 */
export async function fetchCarDetail(slug: string): Promise<FullCar> {
  if (!slug || slug.length < 3) {
    throw new Error("Invalid car slug");
  }

  const ref = doc(dbTracker, "cars", slug);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    throw new Error("Car not found");
  }

  const data = snap.data() as FullCar;

  return {
    ...data,
    Image: getCarImageUrl(data.Image),
  };
}

// Shape of the status doc as stored in Firestore
type FirestoreStatusDoc = {
  status?: string;
  message?: string;
  updatedAt?: Timestamp | Date | string;
  createdAt?: Timestamp | Date | string;
};

function toIsoString(
  v?: Timestamp | Date | string
): string | undefined {
  if (!v) return undefined;
  if (typeof v === "string") return v;
  if (v instanceof Date) return v.toISOString();
  if ("toDate" in v && typeof v.toDate === "function") {
    return v.toDate().toISOString();
  }
  return undefined;
}

/**
 * Fetch car status from Firestore `car_data_status` collection.
 * Docs are keyed by normalizedKey (same as slug).
 */
export async function fetchCarStatus(slug: string): Promise<CarStatus | null> {
  if (!slug || slug.length < 3) return null;

  const ref = doc(dbTracker, "car_data_status", slug);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    return null;
  }

  const raw = snap.data() as FirestoreStatusDoc;

  const statusDoc: ApiStatusDoc = {
    status: raw.status ?? "unknown",
    message: raw.message,
    updatedAt: toIsoString(raw.updatedAt),
    createdAt: toIsoString(raw.createdAt),
  };

  return mapApiStatus(statusDoc);
}