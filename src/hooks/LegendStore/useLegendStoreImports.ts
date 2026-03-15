import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { dbTracker } from "@/Firebase/client";
import type { LegendStoreImport } from "@/types/LegendStore";

type FSImport = {
  Class?: string;
  Brand?: string;
  Model?: string;
  GarageLevel?: number;
  StarRank?: number;
  CarRarity?: string;
  ImportRarity?: string;
  TradeCoinCost?: number;
  DailyLimit?: number;
};

export function useLegendStoreImports() {
  const [items, setItems] = useState<LegendStoreImport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const snap = await getDocs(
          collection(dbTracker, "importTradeCoins")
        );

        const list: LegendStoreImport[] = snap.docs.map((doc) => {
          const d = doc.data() as FSImport;
          return {
            Class: String(d.Class || "").trim(),
            Brand: String(d.Brand || "").trim(),
            Model: String(d.Model || "").trim(),
            GarageLevel:
              typeof d.GarageLevel === "number" ? d.GarageLevel : undefined,
            StarRank: Number(d.StarRank || 0),
            CarRarity: String(d.CarRarity || "").trim(),
            ImportRarity: String(d.ImportRarity || "").trim(),
            TradeCoinCost: Number(d.TradeCoinCost || 0),
            DailyLimit: Number(d.DailyLimit || 1),
          };
        });

        setItems(list);
      } catch (e) {
        console.error("[useLegendStoreImports] load failed", e);
        setError("Failed to load Import data.");
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, []);

  return { items, loading, error };
}