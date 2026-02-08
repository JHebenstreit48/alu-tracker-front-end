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
  key: string;    // normalizedKey (or docId fallback)
  prefer: number; // higher wins (new format wins)
};

function pickString(obj: AnyObj, legacyKey: string, newKey: string): string {
  const v = obj[legacyKey] ?? obj[newKey];
  return v == null ? "" : String(v);
}

function pickNumber(obj: AnyObj, legacyKey: string, newKey: string): number | undefined {
  const v = obj[legacyKey] ?? obj[newKey];
  if (typeof v === "number") return v;
  if (typeof v === "string" && v.trim() !== "" && !isNaN(Number(v))) return Number(v);
  return undefined;
}

function pickBool(obj: AnyObj, legacyKey: string, newKey: string): boolean | undefined {
  const v = obj[legacyKey] ?? obj[newKey];
  return typeof v === "boolean" ? v : undefined;
}

function pickStringArrayOrString(
  obj: AnyObj,
  legacyKey: string,
  newKey: string
): string[] | string | null | undefined {
  const v = obj[legacyKey] ?? obj[newKey];
  if (v === null) return null;
  if (typeof v === "string") return v;
  if (Array.isArray(v) && v.every((x) => typeof x === "string")) return v as string[];
  return undefined;
}

function isNewFormat(raw: AnyObj): boolean {
  return (
    Object.prototype.hasOwnProperty.call(raw, "brand") ||
    Object.prototype.hasOwnProperty.call(raw, "class") ||
    Object.prototype.hasOwnProperty.call(raw, "image")
  );
}

function resolveImageUrl(raw: string): string | undefined {
  const s = (raw ?? "").trim();
  if (!s) return undefined;
  if (/^https?:\/\//i.test(s) || s.startsWith("data:")) return s;
  return getCarImageUrl(s);
}

/**
 * Convert Firestore doc (legacy OR new) into canonical Car.
 */
function toCar(docId: string, raw: AnyObj): CarWithMeta | null {
  const brand = pickString(raw, "Brand", "brand").trim();
  const model = pickString(raw, "Model", "model").trim();
  const klass = pickString(raw, "Class", "class").trim();

  if (!brand || !model || !klass) return null;

  const imageRaw = pickString(raw, "Image", "image");
  const rarity = (pickString(raw, "Rarity", "rarity") || "Unknown").trim();
  const stars = pickNumber(raw, "Stars", "stars") ?? 0;
  const id = pickNumber(raw, "Id", "id") ?? 0;

  const country = (pickString(raw, "Country", "country") || "").trim() || undefined;
  const obtainableVia =
    pickStringArrayOrString(raw, "ObtainableVia", "obtainableVia") ?? null;

  const keyCar = pickBool(raw, "KeyCar", "keyCar");

  const normalizedKey =
    typeof raw.normalizedKey === "string" && raw.normalizedKey.trim()
      ? raw.normalizedKey.trim()
      : docId;

  const car: Car = {
    id,
    brand,
    model,
    class: klass,
    image: resolveImageUrl(imageRaw),
    rarity,
    stars,
    country,
    obtainableVia,
    keyCar,
    normalizedKey,
  };

  return {
    car,
    key: normalizedKey,
    prefer: isNewFormat(raw) ? 2 : 1,
  };
}

function consumeSnap(snap: QuerySnapshot<DocumentData>, merged: Map<string, CarWithMeta>) {
  snap.docs.forEach((d) => {
    const raw = d.data() as AnyObj;
    const mapped = toCar(d.id, raw);
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
      const classFilterActive = selectedClass && selectedClass !== "All Classes";

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
        const byBrand = (a.brand || "").localeCompare(b.brand || "");
        if (byBrand !== 0) return byBrand;
        return (a.model || "").localeCompare(b.model || "");
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