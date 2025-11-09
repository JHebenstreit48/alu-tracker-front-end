import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { dbTracker } from "@/Firebase/client";
import type { Brand } from "@/types/Brands";

export function useBrandBySlug(slug?: string) {
  const [brand, setBrand] = useState<Brand | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) {
      setError("Missing brand slug.");
      setLoading(false);
      return;
    }

    const load = async () => {
      try {
        const ref = doc(dbTracker, "brands", slug);
        const snap = await getDoc(ref);

        if (!snap.exists()) {
          setError("Brand not found.");
          setBrand(null);
        } else {
          const data = snap.data() as Brand;
          setBrand({ ...data, slug: data.slug || snap.id });
        }
      } catch (err) {
        console.error("[useBrandBySlug] Failed to load brand:", err);
        setError("Failed to load brand details.");
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, [slug]);

  return { brand, loading, error };
}