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

export interface CarDoc {
  id: string;

  Brand: string;
  Model: string;
  Class: string;
  Image: string;

  Rarity?: string;
  Stars?: number;
  Country?: string;
  ObtainableVia?: string[] | string | null;
  KeyCar?: boolean;
  normalizedKey?: string;

  [key: string]: unknown;
}

type AnyObj = Record<string, unknown>;

function pickString(data: AnyObj, legacyKey: string, newKey: string): string {
  const v = data[legacyKey] ?? data[newKey];
  return v == null ? "" : String(v);
}

function pickNumber(data: AnyObj, legacyKey: string, newKey: string): number | undefined {
  const v = data[legacyKey] ?? data[newKey];
  return typeof v === "number" ? v : undefined;
}

const carConverter: FirestoreDataConverter<CarDoc> = {
  toFirestore(car: CarDoc): DocumentData {
    return { ...car };
  },

  fromFirestore(snapshot: QueryDocumentSnapshot<DocumentData>): CarDoc {
    const data = snapshot.data() as AnyObj;
    const id = snapshot.id;

    const Brand = pickString(data, "Brand", "brand");
    const Model = pickString(data, "Model", "model");
    const Class = pickString(data, "Class", "class");
    const Image = pickString(data, "Image", "image");

    const base: CarDoc = { id, Brand, Model, Class, Image };

    const rarity = data.Rarity ?? data.rarity;
    if (typeof rarity === "string") base.Rarity = rarity;

    const stars = pickNumber(data, "Stars", "stars");
    if (stars !== undefined) base.Stars = stars;

    const country = data.Country ?? data.country;
    if (typeof country === "string") base.Country = country;

    const ov = data.ObtainableVia ?? data.obtainableVia;
    if (ov === null || typeof ov === "string" || Array.isArray(ov)) {
      base.ObtainableVia = ov as CarDoc["ObtainableVia"];
    }

    const keyCar = data.KeyCar ?? data.keyCar;
    if (typeof keyCar === "boolean") base.KeyCar = keyCar;

    const nk = data.normalizedKey;
    if (typeof nk === "string") base.normalizedKey = nk;

    // Keep extras
    for (const [k, v] of Object.entries(data)) {
      if (!(k in base)) base[k] = v as unknown;
    }

    return base;
  },
};

const carsCol = collection(dbTracker, "cars").withConverter(carConverter);

export class FirebaseCarsAdapter {
  async list(limitCount = 2000): Promise<CarDoc[]> {
    const q = query(carsCol, orderBy("normalizedKey"), limit(limitCount));
    const snap = await getDocs(q);
    return snap.docs.map((d) => d.data());
  }

  async getById(id: string): Promise<CarDoc> {
    const ref = doc(carsCol, id);
    const snap = await getDoc(ref);
    if (!snap.exists()) throw new Error(`Car not found: ${id}`);
    return snap.data();
  }
}