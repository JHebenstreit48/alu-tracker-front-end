import { useMemo, useState } from "react";
import type { CarStatsPatch } from "@/types/CarDataSubmission/carSubmission";

type Props = {
  selectedKeys: string[];
  onApplyStats: (stats: CarStatsPatch) => void;
};

type NumState = string;

const toNum = (s: string): number | undefined => {
  const t = s.trim();
  if (!t) return undefined;
  const n = Number(t);
  return Number.isFinite(n) ? n : undefined;
};

export default function StatsFields({ selectedKeys, onApplyStats }: Props): JSX.Element {
  const disabled = selectedKeys.length === 0;

  // Blueprints
  const [bp1, setBp1] = useState<NumState>("");
  const [bp2, setBp2] = useState<NumState>("");
  const [bp3, setBp3] = useState<NumState>("");
  const [bp4, setBp4] = useState<NumState>("");
  const [bp5, setBp5] = useState<NumState>("");
  const [bp6, setBp6] = useState<NumState>("");

  // Stock
  const [stockRank, setStockRank] = useState<NumState>("");
  const [stockTopSpeed, setStockTopSpeed] = useState<NumState>("");
  const [stockAccel, setStockAccel] = useState<NumState>("");
  const [stockHandling, setStockHandling] = useState<NumState>("");
  const [stockNitro, setStockNitro] = useState<NumState>("");

  // Max Star (rank-only scaffold)
  const [max1, setMax1] = useState<NumState>("");
  const [max2, setMax2] = useState<NumState>("");
  const [max3, setMax3] = useState<NumState>("");
  const [max4, setMax4] = useState<NumState>("");
  const [max5, setMax5] = useState<NumState>("");
  const [max6, setMax6] = useState<NumState>("");

  // Gold
  const [goldRank, setGoldRank] = useState<NumState>("");
  const [goldTopSpeed, setGoldTopSpeed] = useState<NumState>("");
  const [goldAccel, setGoldAccel] = useState<NumState>("");
  const [goldHandling, setGoldHandling] = useState<NumState>("");
  const [goldNitro, setGoldNitro] = useState<NumState>("");

  const anyValue = useMemo(() => {
    const all = [
      bp1, bp2, bp3, bp4, bp5, bp6,
      stockRank, stockTopSpeed, stockAccel, stockHandling, stockNitro,
      max1, max2, max3, max4, max5, max6,
      goldRank, goldTopSpeed, goldAccel, goldHandling, goldNitro,
    ];
    return all.some((x) => x.trim() !== "");
  }, [
    bp1, bp2, bp3, bp4, bp5, bp6,
    stockRank, stockTopSpeed, stockAccel, stockHandling, stockNitro,
    max1, max2, max3, max4, max5, max6,
    goldRank, goldTopSpeed, goldAccel, goldHandling, goldNitro,
  ]);

  const apply = () => {
    if (disabled || !anyValue) return;

    const stats: CarStatsPatch = {};

    // 1) Blueprints
    const blueprints: Record<string, unknown> = {};
    const b1 = toNum(bp1); const b2 = toNum(bp2); const b3 = toNum(bp3);
    const b4 = toNum(bp4); const b5 = toNum(bp5); const b6 = toNum(bp6);
    if (b1 !== undefined) blueprints.oneStar = b1;
    if (b2 !== undefined) blueprints.twoStar = b2;
    if (b3 !== undefined) blueprints.threeStar = b3;
    if (b4 !== undefined) blueprints.fourStar = b4;
    if (b5 !== undefined) blueprints.fiveStar = b5;
    if (b6 !== undefined) blueprints.sixStar = b6;
    if (Object.keys(blueprints).length) stats.blueprints = blueprints;

    // 2) Stock
    const stock: Record<string, unknown> = {};
    const sRank = toNum(stockRank);
    const sTS = toNum(stockTopSpeed);
    const sA = toNum(stockAccel);
    const sH = toNum(stockHandling);
    const sN = toNum(stockNitro);
    if (sRank !== undefined) stock.rank = sRank;
    if (sTS !== undefined) stock.topSpeed = sTS;
    if (sA !== undefined) stock.acceleration = sA;
    if (sH !== undefined) stock.handling = sH;
    if (sN !== undefined) stock.nitro = sN;
    if (Object.keys(stock).length) stats.stock = stock;

    // 3) Max Star Rank
    const maxAtStar: Record<string, unknown> = {};
    const m1 = toNum(max1); const m2 = toNum(max2); const m3 = toNum(max3);
    const m4 = toNum(max4); const m5 = toNum(max5); const m6 = toNum(max6);
    if (m1 !== undefined) maxAtStar.oneStarMaxRank = m1;
    if (m2 !== undefined) maxAtStar.twoStarMaxRank = m2;
    if (m3 !== undefined) maxAtStar.threeStarMaxRank = m3;
    if (m4 !== undefined) maxAtStar.fourStarMaxRank = m4;
    if (m5 !== undefined) maxAtStar.fiveStarMaxRank = m5;
    if (m6 !== undefined) maxAtStar.sixStarMaxRank = m6;
    if (Object.keys(maxAtStar).length) stats.maxAtStar = maxAtStar;

    // 4) Gold
    const gold: Record<string, unknown> = {};
    const gRank = toNum(goldRank);
    const gTS = toNum(goldTopSpeed);
    const gA = toNum(goldAccel);
    const gH = toNum(goldHandling);
    const gN = toNum(goldNitro);
    if (gRank !== undefined) gold.rank = gRank;
    if (gTS !== undefined) gold.topSpeed = gTS;
    if (gA !== undefined) gold.acceleration = gA;
    if (gH !== undefined) gold.handling = gH;
    if (gN !== undefined) gold.nitro = gN;
    if (Object.keys(gold).length) stats.gold = gold;

    onApplyStats(stats);
  };

  return (
    <div className="StatsFields">
      <p className="CarDataFormHint">
        Simple number inputs. Leave blank to skip changing that stat.
      </p>

      <div className="StatsBlocks">
        <section className="StatsBlock">
          <h3 className="StatsBlockTitle">Blueprints</h3>
          <div className="StatsGrid">
            <Field label="1★" v={bp1} s={setBp1} />
            <Field label="2★" v={bp2} s={setBp2} />
            <Field label="3★" v={bp3} s={setBp3} />
            <Field label="4★" v={bp4} s={setBp4} />
            <Field label="5★" v={bp5} s={setBp5} />
            <Field label="6★" v={bp6} s={setBp6} />
          </div>
        </section>

        <section className="StatsBlock">
          <h3 className="StatsBlockTitle">Stock</h3>
          <div className="StatsGrid StatsGrid--nitroCenter">
            <Field label="Rank" v={stockRank} s={setStockRank} />
            <Field label="Top Speed" v={stockTopSpeed} s={setStockTopSpeed} />
            <Field label="Acceleration" v={stockAccel} s={setStockAccel} />
            <Field label="Handling" v={stockHandling} s={setStockHandling} />
            <div className="StatsNitro">
              <Field label="Nitro" v={stockNitro} s={setStockNitro} />
            </div>
          </div>
        </section>

        <section className="StatsBlock">
          <h3 className="StatsBlockTitle">Max Star (Rank)</h3>
          <div className="StatsGrid">
            <Field label="1★ Max Rank" v={max1} s={setMax1} />
            <Field label="2★ Max Rank" v={max2} s={setMax2} />
            <Field label="3★ Max Rank" v={max3} s={setMax3} />
            <Field label="4★ Max Rank" v={max4} s={setMax4} />
            <Field label="5★ Max Rank" v={max5} s={setMax5} />
            <Field label="6★ Max Rank" v={max6} s={setMax6} />
          </div>
        </section>

        <section className="StatsBlock">
          <h3 className="StatsBlockTitle">Gold</h3>
          <div className="StatsGrid StatsGrid--nitroCenter">
            <Field label="Rank" v={goldRank} s={setGoldRank} />
            <Field label="Top Speed" v={goldTopSpeed} s={setGoldTopSpeed} />
            <Field label="Acceleration" v={goldAccel} s={setGoldAccel} />
            <Field label="Handling" v={goldHandling} s={setGoldHandling} />
            <div className="StatsNitro">
              <Field label="Nitro" v={goldNitro} s={setGoldNitro} />
            </div>
          </div>
        </section>
      </div>

      <div className="CarDataFormRow">
        <button type="button" onClick={apply} disabled={disabled || !anyValue}>
          Apply stats to selected
        </button>
      </div>
    </div>
  );
}

function Field({ label, v, s }: { label: string; v: string; s: (x: string) => void }) {
  return (
    <label className="CarDataFormLabel">
      {label}
      <input value={v} onChange={(e) => s(e.target.value)} inputMode="decimal" />
    </label>
  );
}