import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { dbTracker } from "@/Firebase/client";
import type { LegendStoreBlueprint } from "@/interfaces/LegendStore";

type FSBlueprint = {
  Class?: string;
  Brand?: string;
  Model?: string;
  GarageLevel?: number;
  StarRank?: number;
  CarRarity?: string;
  BlueprintPrices?: unknown;
};

export function useLegendStoreBlueprints() {
  const [items, setItems] = useState<LegendStoreBlueprint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const snap = await getDocs(collection(dbTracker, "blueprints"));

        const list: LegendStoreBlueprint[] = snap.docs.map((doc) => {
          const d = doc.data() as FSBlueprint;

          const prices =
            Array.isArray(d.BlueprintPrices)
              ? d.BlueprintPrices.map((v) => Number(v)).filter((n) =>
                  Number.isFinite(n)
                )
              : [];

          return {
            Class: String(d.Class || "").trim(),
            Brand: String(d.Brand || "").trim(),
            Model: String(d.Model || "").trim(),
            GarageLevel:
              typeof d.GarageLevel === "number" ? d.GarageLevel : undefined,
            StarRank: Number(d.StarRank || 0),
            CarRarity: String(d.CarRarity || "").trim(),
            BlueprintPrices: prices,
          };
        });

        setItems(list);
      } catch (e) {
        console.error("[useLegendStoreBlueprints] load failed", e);
        setError("Failed to load Legend Store data.");
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, []);

  return { items, loading, error };
}