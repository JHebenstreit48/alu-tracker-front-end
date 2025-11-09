import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  query,
  orderBy,
} from "firebase/firestore";
import { dbTracker } from "@/Firebase/client";
import type { Brand } from "@/types/Brands";

export function useBrands() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const col = collection(dbTracker, "brands");
        const q = query(col, orderBy("brand"));
        const snap = await getDocs(q);

        const list: Brand[] = snap.docs.map((doc) => {
          const data = doc.data() as Brand;
          // Ensure slug is set from doc id if missing (paranoia)
          return { ...data, slug: data.slug || doc.id };
        });

        setBrands(list);
      } catch (err) {
        console.error("[useBrands] Failed to load brands from Firestore:", err);
        setError("Failed to load manufacturers.");
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, []);

  return { brands, loading, error };
}