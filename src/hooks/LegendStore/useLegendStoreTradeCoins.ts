import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { dbTracker } from "@/Firebase/client";
import type { LegendStoreTradeCoin } from "@/types/LegendStore";

type FSTradeCoin = {
  Class?: string;
  Brand?: string;
  Model?: string;
  GarageLevel?: number;
  StarRank?: number;
  CarRarity?: string;
  TradeCoinCost?: number;
  DailyLimit?: number;
};

export function useLegendStoreTradeCoins() {
  const [items, setItems] = useState<LegendStoreTradeCoin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const snap = await getDocs(
          collection(dbTracker, "blueprintTradeCoins")
        );

        const list: LegendStoreTradeCoin[] = snap.docs.map((doc) => {
          const d = doc.data() as FSTradeCoin;
          return {
            Class: String(d.Class || "").trim(),
            Brand: String(d.Brand || "").trim(),
            Model: String(d.Model || "").trim(),
            GarageLevel:
              typeof d.GarageLevel === "number" ? d.GarageLevel : undefined,
            StarRank: Number(d.StarRank || 0),
            CarRarity: String(d.CarRarity || "").trim(),
            TradeCoinCost: Number(d.TradeCoinCost || 0),
            DailyLimit: Number(d.DailyLimit || 1),
          };
        });

        setItems(list);
      } catch (e) {
        console.error("[useLegendStoreTradeCoins] load failed", e);
        setError("Failed to load Trade Coin data.");
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, []);

  return { items, loading, error };
}