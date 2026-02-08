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
import type { Car } from "@/types/shared/car";

type AnyObj = Record<string, unknown>;

function pickString(data: AnyObj, legacyKey: string, newKey: string): string {
  const v = data[legacyKey] ?? data[newKey];
  return v == null ? "" : String(v);
}

function pickNumber(data: AnyObj, legacyKey: string, newKey: string): number | undefined {
  const v = data[legacyKey] ?? data[newKey];
  if (typeof v === "number") return v;
  if (typeof v === "string" && v.trim() !== "" && !isNaN(Number(v))) return Number(v);
  return undefined;
}

function pickBool(data: AnyObj, legacyKey: string, newKey: string): boolean | undefined {
  const v = data[legacyKey] ?? data[newKey];
  return typeof v === "boolean" ? v : undefined;
}

function pickStringArrayOrString(
  data: AnyObj,
  legacyKey: string,
  newKey: string
): string[] | string | null | undefined {
  const v = data[legacyKey] ?? data[newKey];
  if (v === null) return null;
  if (typeof v === "string") return v;
  if (Array.isArray(v) && v.every((x) => typeof x === "string")) return v as string[];
  return undefined;
}

const carConverter: FirestoreDataConverter<Car> = {
  toFirestore(car: Car): DocumentData {
    return { ...car };
  },

  fromFirestore(snapshot: QueryDocumentSnapshot<DocumentData>): Car {
    const data = snapshot.data() as AnyObj;

    const brand = pickString(data, "Brand", "brand").trim();
    const model = pickString(data, "Model", "model").trim();
    const klass = pickString(data, "Class", "class").trim();
    const image = pickString(data, "Image", "image").trim();

    // ✅ avoid mixing ?? and || (use parentheses + a temp)
    const idFromField = pickNumber(data, "Id", "id");
    const idFromDocId = Number(snapshot.id);
    const id =
      idFromField ?? (Number.isFinite(idFromDocId) ? idFromDocId : 0);

    const rarity = (pickString(data, "Rarity", "rarity") || "Unknown").trim();
    const stars = pickNumber(data, "Stars", "stars") ?? 0;
    const country = (pickString(data, "Country", "country") || "").trim() || undefined;

    const obtainableVia =
      pickStringArrayOrString(data, "ObtainableVia", "obtainableVia") ?? null;

    const keyCar = pickBool(data, "KeyCar", "keyCar");

    const normalizedKey =
      typeof data.normalizedKey === "string" && data.normalizedKey.trim()
        ? data.normalizedKey.trim()
        : snapshot.id;

    return {
      id,
      brand,
      model,
      class: klass,
      image: image || undefined,
      rarity,
      stars,
      country,
      obtainableVia,
      keyCar,
      normalizedKey,
    };
  },
};

const carsCol = collection(dbTracker, "cars").withConverter(carConverter);

export class FirebaseCarsAdapter {
  async list(limitCount = 2000): Promise<Car[]> {
    // If orderBy("normalizedKey") ever errors due to missing field,
    // swap to orderBy("brand") temporarily.
    const q = query(carsCol, orderBy("normalizedKey"), limit(limitCount));
    const snap = await getDocs(q);
    return snap.docs.map((d) => d.data());
  }

  async getById(id: string): Promise<Car> {
    const ref = doc(carsCol, id);
    const snap = await getDoc(ref);
    if (!snap.exists()) throw new Error(`Car not found: ${id}`);
    return snap.data();
  }
}