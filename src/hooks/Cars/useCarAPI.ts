import { useState, useCallback, useEffect } from "react";
import {
  collection,
  getDocs,
  query,
  where,
  limit,
  type QueryConstraint,
  type QuerySnapshot,
  type DocumentData,
} from "firebase/firestore";
import { dbTracker } from "@/Firebase/client";
import type { Car } from "@/types/shared/car";
import { getCarImageUrl } from "@/utils/shared/imageUrl";

type AnyObj = Record<string, unknown>;

type CarWithMeta = {
  car: Car;
  key: string;        // normalizedKey (or docId fallback)
  prefer: number;     // higher wins (new format wins)
};

function pickString(obj: AnyObj, legacyKey: string, newKey: string): string {
  const v = obj[legacyKey] ?? obj[newKey];
  return v == null ? "" : String(v);
}

function pickNumber(obj: AnyObj, legacyKey: string, newKey: string): number | undefined {
  const v = obj[legacyKey] ?? obj[newKey];
  return typeof v === "number" ? v : undefined;
}

function isNewFormat(raw: AnyObj): boolean {
  // light heuristic: any of these camelCase keys implies new schema
  return (
    Object.prototype.hasOwnProperty.call(raw, "brand") ||
    Object.prototype.hasOwnProperty.call(raw, "class") ||
    Object.prototype.hasOwnProperty.call(raw, "image")
  );
}

/**
 * Convert Firestore doc (legacy OR new) into legacy UI shape (Car).
 * Returns null if required identity fields are missing.
 */
function toLegacyUiCar(docId: string, raw: AnyObj): CarWithMeta | null {
  const Brand = pickString(raw, "Brand", "brand").trim();
  const Model = pickString(raw, "Model", "model").trim();
  const Class = pickString(raw, "Class", "class").trim();

  if (!Brand || !Model || !Class) return null;

  const ImageRaw = pickString(raw, "Image", "image");
  const Rarity = pickString(raw, "Rarity", "rarity") || "Unknown";
  const Stars = pickNumber(raw, "Stars", "stars") ?? 0;
  const Id = pickNumber(raw, "Id", "id") ?? 0;

  const Country = pickString(raw, "Country", "country") || undefined;
  const ObtainableVia = (raw.ObtainableVia ?? raw.obtainableVia) as
    | string[]
    | string
    | null
    | undefined;

  const KeyCar = (raw.KeyCar ?? raw.keyCar) as boolean | undefined;

  const normalizedKey =
    typeof raw.normalizedKey === "string" && raw.normalizedKey.trim()
      ? raw.normalizedKey
      : docId;

  const car: Car = {
    Id,
    Brand,
    Model,
    Class,
    Image: ImageRaw ? getCarImageUrl(ImageRaw) : undefined,
    Rarity,
    Stars,
    Country,
    ObtainableVia: ObtainableVia ?? null,
    KeyCar,
  };

  return {
    car,
    key: normalizedKey,
    prefer: isNewFormat(raw) ? 2 : 1, // new-format wins ties
  };
}

function consumeSnap(
  snap: QuerySnapshot<DocumentData>,
  merged: Map<string, CarWithMeta>
) {
  snap.docs.forEach((d) => {
    const raw = d.data() as AnyObj;
    const mapped = toLegacyUiCar(d.id, raw);
    if (!mapped) return;

    const prev = merged.get(mapped.key);
    if (!prev || mapped.prefer >= prev.prefer) {
      merged.set(mapped.key, mapped);
    }
  });
}

export function useCarAPI(selectedClass: string) {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadCars = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const carsCol = collection(dbTracker, "cars");
      const classFilterActive =
        selectedClass && selectedClass !== "All Classes";

      const cap = 2000;
      const merged = new Map<string, CarWithMeta>();

      if (!classFilterActive) {
        const snap = await getDocs(query(carsCol, limit(cap)));
        consumeSnap(snap, merged);
      } else {
        const constraintsLegacy: QueryConstraint[] = [
          where("Class", "==", selectedClass),
          limit(cap),
        ];
        const constraintsNew: QueryConstraint[] = [
          where("class", "==", selectedClass),
          limit(cap),
        ];

        const [snapLegacy, snapNew] = await Promise.all([
          getDocs(query(carsCol, ...constraintsLegacy)),
          getDocs(query(carsCol, ...constraintsNew)),
        ]);

        consumeSnap(snapLegacy, merged);
        consumeSnap(snapNew, merged);
      }

      const list = Array.from(merged.values()).map((x) => x.car);

      list.sort((a, b) => {
        const b1 = (a.Brand || "").localeCompare(b.Brand || "");
        if (b1 !== 0) return b1;
        return (a.Model || "").localeCompare(b.Model || "");
      });

      setCars(list);
    } catch (err) {
      console.error("[useCarAPI] Failed to load cars from Firestore:", err);
      setCars([]);
      setError("Failed to fetch cars. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [selectedClass]);

  useEffect(() => {
    void loadCars();
  }, [loadCars]);

  return { cars, loading, error };
}