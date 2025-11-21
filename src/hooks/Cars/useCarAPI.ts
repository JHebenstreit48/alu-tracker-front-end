import { useState, useCallback, useEffect } from "react";
import {
  collection,
  getDocs,
  query,
  where,
  limit,
  type QueryConstraint,
} from "firebase/firestore";
import { dbTracker } from "@/Firebase/client";
import type { Car } from "@/types/shared/car"; // adjust path if needed
import { getCarImageUrl } from "@/utils/shared/imageUrl"; // adjust to your actual helper path

type FirestoreCar = Car & {
  normalizedKey?: string;
  // any extra fields from seed are fine here
};

export function useCarAPI(selectedClass: string) {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadCars = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const carsCol = collection(dbTracker, "cars");

      const constraints: QueryConstraint[] = [];

      if (selectedClass && selectedClass !== "All Classes") {
        constraints.push(where("Class", "==", selectedClass));
      }

      // Soft safety cap, like old `limit=1000`
      constraints.push(limit(1000));

      const q = constraints.length
        ? query(carsCol, ...constraints)
        : query(carsCol);

      const snap = await getDocs(q);

      const list: FirestoreCar[] = snap.docs.map((doc) => {
        const data = doc.data() as FirestoreCar;
        return {
          ...data,
          Image: getCarImageUrl(data.Image),
        };
      });

      // Sort client-side (Brand → Model), avoids Firestore composite index
      list.sort((a, b) => {
        const b1 = (a.Brand || "").localeCompare(b.Brand || "");
        if (b1 !== 0) return b1;
        return (a.Model || "").localeCompare(b.Model || "");
      });

      setCars(list);
    } catch (err) {
      console.error("[useCarAPI] Failed to load cars from Firestore:", err);
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