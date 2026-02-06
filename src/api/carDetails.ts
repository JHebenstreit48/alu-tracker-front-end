import { doc, getDoc, type Timestamp } from "firebase/firestore";
import { dbTracker } from "@/Firebase/client";

import type { FullCar } from "@/types/shared/car";
import type { CarStatus, ApiStatusDoc } from "@/types/shared/status";
import { mapApiStatus } from "@/utils/CarDetails/status";
import { getCarImageUrl } from "@/utils/shared/imageUrl";

type AnyObj = Record<string, unknown>;

function pickString(data: AnyObj, legacyKey: string, newKey: string): string {
  const v = data[legacyKey] ?? data[newKey];
  return v == null ? "" : String(v);
}

function pickNumber(data: AnyObj, legacyKey: string, newKey: string): number | undefined {
  const v = data[legacyKey] ?? data[newKey];
  return typeof v === "number" ? v : undefined;
}

export async function fetchCarDetail(slug: string): Promise<FullCar> {
  if (!slug || slug.length < 3) throw new Error("Invalid car slug");

  const ref = doc(dbTracker, "cars", slug);
  const snap = await getDoc(ref);

  if (!snap.exists()) throw new Error("Car not found");

  const data = snap.data() as unknown as AnyObj;

  const Brand = pickString(data, "Brand", "brand");
  const Model = pickString(data, "Model", "model");
  const Class = pickString(data, "Class", "class");

  const ImageRaw = pickString(data, "Image", "image");
  const Id = pickNumber(data, "Id", "id") ?? 0;

  const merged: AnyObj = {
    ...data,

    // Ensure legacy fields exist for your current UI/types
    Id,
    Brand,
    Model,
    Class,
    Image: getCarImageUrl(ImageRaw),

    // Optional mirrors for any new code later
    id: Id,
    brand: Brand,
    model: Model,
    class: Class,
    image: ImageRaw,
  };

  return merged as unknown as FullCar;
}

type FirestoreStatusDoc = {
  status?: string;
  message?: string;
  updatedAt?: Timestamp | Date | string;
  createdAt?: Timestamp | Date | string;
};

function toIsoString(v?: Timestamp | Date | string): string | undefined {
  if (!v) return undefined;
  if (typeof v === "string") return v;
  if (v instanceof Date) return v.toISOString();
  if ("toDate" in v && typeof v.toDate === "function") return v.toDate().toISOString();
  return undefined;
}

export async function fetchCarStatus(slug: string): Promise<CarStatus | null> {
  if (!slug || slug.length < 3) return null;

  const ref = doc(dbTracker, "car_data_status", slug);
  const snap = await getDoc(ref);

  if (!snap.exists()) return null;

  const raw = snap.data() as FirestoreStatusDoc;

  const statusDoc: ApiStatusDoc = {
    status: raw.status ?? "unknown",
    message: raw.message,
    updatedAt: toIsoString(raw.updatedAt),
    createdAt: toIsoString(raw.createdAt),
  };

  return mapApiStatus(statusDoc);
}
