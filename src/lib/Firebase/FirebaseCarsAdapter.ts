import {
  collection,
  getDocs,
  getDoc,
  doc,
  query,
  orderBy,
  limit,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  DocumentData,
} from "firebase/firestore";
import { dbTracker } from "@/Firebase/client";

/**
 * Firestore representation of a car document.
 * This matches what you'll seed into the `cars` collection.
 * Extend this as your schema settles, but keep it strict.
 */
export interface CarDoc {
  id: string;          // we will mirror the document ID here
  Brand: string;
  Model: string;
  Class: string;
  Rarity?: string;
  Stars?: number;
  Image: string;       // "/images/..." or a Storage URL
  [key: string]: unknown; // allow extra fields without using `any`
}

const carConverter: FirestoreDataConverter<CarDoc> = {
  toFirestore(car: CarDoc): DocumentData {
    // Everything in CarDoc is serializable; no `any` needed
    return { ...car };
  },
  fromFirestore(snapshot: QueryDocumentSnapshot<DocumentData>): CarDoc {
    const data = snapshot.data();

    const id = snapshot.id;
    const Brand = String(data.Brand ?? "");
    const Model = String(data.Model ?? "");
    const Class = String(data.Class ?? "");
    const Image = String(data.Image ?? "");

    const base: CarDoc = {
      id,
      Brand,
      Model,
      Class,
      Image,
    };

    // Optional typed extras
    if (typeof data.Rarity === "string") {
      base.Rarity = data.Rarity;
    }
    if (typeof data.Stars === "number") {
      base.Stars = data.Stars;
    }

    // Copy any remaining fields as `unknown` so they're available but not magically typed
    for (const [key, value] of Object.entries(data)) {
      if (!(key in base)) {
        base[key] = value as unknown;
      }
    }

    return base;
  },
};

const carsCol = collection(dbTracker, "cars").withConverter(carConverter);

export class FirebaseCarsAdapter {
  /**
   * List cars ordered by Brand (tweak as needed)
   */
  async list(limitCount = 500): Promise<CarDoc[]> {
    const q = query(carsCol, orderBy("Brand"), limit(limitCount));
    const snap = await getDocs(q);
    return snap.docs.map((docSnap) => docSnap.data());
  }

  /**
   * Get one car by id.
   * Assumes you use the Firestore document ID as the car id (e.g. normalizedKey).
   * This is safer and cheaper than querying on a field.
   */
  async getById(id: string): Promise<CarDoc> {
    const ref = doc(carsCol, id);
    const snap = await getDoc(ref);
    if (!snap.exists()) {
      throw new Error(`Car not found: ${id}`);
    }
    return snap.data();
  }
}