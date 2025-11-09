import { useEffect, useState } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { dbTracker } from "@/Firebase/client";
import { getCarImageUrl } from "@/utils/shared/imageUrl";
import type {
  GarageLevelsInterface,
  Car,
} from "@/interfaces/GarageLevels";

type FSGarageLevel = {
  GarageLevelKey: number;
  xp: number;
  cars?: { brand: string; model: string; image?: string }[];
};

export function useGarageLevels() {
  const [levels, setLevels] = useState<GarageLevelsInterface[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const colRef = collection(dbTracker, "garagelevels");
        const q = query(colRef, orderBy("GarageLevelKey", "asc"));
        const snap = await getDocs(q);

        const list: GarageLevelsInterface[] = snap.docs.map((doc) => {
          const data = doc.data() as FSGarageLevel;

          const cars: Car[] = (data.cars || []).map((c) => ({
            brand: String(c.brand),
            model: String(c.model),
            image: getCarImageUrl(c.image || ""),
          }));

          return {
            GarageLevelKey: Number(data.GarageLevelKey),
            xp: Number(data.xp),
            cars,
          };
        });

        setLevels(list);
      } catch (e) {
        console.error("[useGarageLevels] Failed to load:", e);
        setError("Failed to load garage levels.");
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, []);

  return { levels, loading, error };
}