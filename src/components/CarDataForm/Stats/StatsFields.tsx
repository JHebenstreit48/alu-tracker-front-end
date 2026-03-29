import { useMemo, useState } from "react";
import type { Car } from "@/types/shared/car";
import type { CarStatsPatch, StarStatBlock } from
  "@/types/CarDataSubmission/carSubmission";

type Props = {
  selectedKeys: string[];
  selectedCars: Car[];
  onApplyStats: (stats: CarStatsPatch) => void;
};

type NumState = string;

const toNum = (s: string): number | undefined => {
  const t = s.trim();
  if (!t) return undefined;
  const n = Number(t);
  return Number.isFinite(n) ? n : undefined;
};

type StatBlockState = {
  rank: string;
  topSpeed: string;
  accel: string;
  handling: string;
  nitro: string;
};

const emptyBlock = (): StatBlockState => ({
  rank: "",
  topSpeed: "",
  accel: "",
  handling: "",
  nitro: "",
});

const blockToStat = (b: StatBlockState): StarStatBlock | undefined => {
  const out: StarStatBlock = {};
  const r = toNum(b.rank);
  const ts = toNum(b.topSpeed);
  const a = toNum(b.accel);
  const h = toNum(b.handling);
  const n = toNum(b.nitro);
  if (r !== undefined) out.rank = r;
  if (ts !== undefined) out.topSpeed = ts;
  if (a !== undefined) out.acceleration = a;
  if (h !== undefined) out.handling = h;
  if (n !== undefined) out.nitro = n;
  return Object.keys(out).length ? out : undefined;
};

const anyInBlock = (b: StatBlockState): boolean =>
  Object.values(b).some((v) => v.trim() !== "");

const STAR_KEYS = [
  "oneStar",
  "twoStar",
  "threeStar",
  "fourStar",
  "fiveStar",
  "sixStar",
] as const;

const STAR_LABELS = ["1★", "2★", "3★", "4★", "5★", "6★"];

export default function StatsFields({
  selectedKeys,
  selectedCars,
  onApplyStats,
}: Props): JSX.Element {
  const disabled = selectedKeys.length === 0;

  const [bp1, setBp1] = useState<NumState>("");
  const [bp2, setBp2] = useState<NumState>("");
  const [bp3, setBp3] = useState<NumState>("");
  const [bp4, setBp4] = useState<NumState>("");
  const [bp5, setBp5] = useState<NumState>("");
  const [bp6, setBp6] = useState<NumState>("");

  const [stock, setStock] = useState<StatBlockState>(emptyBlock());
  const [max1, setMax1] = useState<StatBlockState>(emptyBlock());
  const [max2, setMax2] = useState<StatBlockState>(emptyBlock());
  const [max3, setMax3] = useState<StatBlockState>(emptyBlock());
  const [max4, setMax4] = useState<StatBlockState>(emptyBlock());
  const [max5, setMax5] = useState<StatBlockState>(emptyBlock());
  const [max6, setMax6] = useState<StatBlockState>(emptyBlock());
  const [gold, setGold] = useState<StatBlockState>(emptyBlock());
  const [applied, setApplied] = useState<boolean>(false);

  const maxBlocks = [max1, max2, max3, max4, max5, max6];
  const maxSetters = [setMax1, setMax2, setMax3, setMax4, setMax5, setMax6];

  const maxStars = useMemo(() => {
    if (selectedCars.length === 1 && selectedCars[0].stars) {
      return selectedCars[0].stars;
    }
    return 6;
  }, [selectedCars]);

  const anyValue = useMemo(() => {
    const bps = [bp1, bp2, bp3, bp4, bp5, bp6];
    return (
      bps.some((x) => x.trim() !== "") ||
      anyInBlock(stock) ||
      maxBlocks.some(anyInBlock) ||
      anyInBlock(gold)
    );
  }, [bp1, bp2, bp3, bp4, bp5, bp6, stock, maxBlocks, gold]);

  const apply = () => {
    if (disabled || !anyValue) return;

    const stats: CarStatsPatch = {};

    const blueprints: Record<string, unknown> = {};
    const b1 = toNum(bp1);
    const b2 = toNum(bp2);
    const b3 = toNum(bp3);
    const b4 = toNum(bp4);
    const b5 = toNum(bp5);
    const b6 = toNum(bp6);
    if (b1 !== undefined) blueprints.oneStar = b1;
    if (b2 !== undefined) blueprints.twoStar = b2;
    if (b3 !== undefined) blueprints.threeStar = b3;
    if (b4 !== undefined) blueprints.fourStar = b4;
    if (b5 !== undefined) blueprints.fiveStar = b5;
    if (b6 !== undefined) blueprints.sixStar = b6;
    if (Object.keys(blueprints).length) stats.blueprints = blueprints;

    const stockStat = blockToStat(stock);
    if (stockStat) stats.stock = stockStat;

    const maxAtStar: CarStatsPatch["maxAtStar"] = {};
    maxBlocks.forEach((block, i) => {
      const stat = blockToStat(block);
      if (stat) maxAtStar[STAR_KEYS[i]] = stat;
    });
    if (Object.keys(maxAtStar).length) stats.maxAtStar = maxAtStar;

    const goldStat = blockToStat(gold);
    if (goldStat) stats.gold = goldStat;

    onApplyStats(stats);
    setApplied(true);
    setTimeout(() => setApplied(false), 3000);
  };

  const updateBlock = (
    setter: React.Dispatch<React.SetStateAction<StatBlockState>>,
    field: keyof StatBlockState,
    value: string
  ) => {
    setter((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="StatsFields">
      <p className="CarDataFormHint">
        Simple number inputs. Leave blank to skip changing that stat.
        {selectedCars.length === 1 && (
          <span> Showing stats for a {selectedCars[0].stars}★ car.</span>
        )}
      </p>
      <p className="CarDataFormHint">
        <span style={{ color: "#ffc400" }}>
          ★ Top Speed must be entered in KPH.
        </span>
      </p>

      <div className="StatsBlocks">
        <section className="StatsBlock">
          <h3 className="StatsBlockTitle">Blueprints</h3>
          <div className="StatsGrid">
            {[
              [bp1, setBp1, "1★"],
              [bp2, setBp2, "2★"],
              [bp3, setBp3, "3★"],
              [bp4, setBp4, "4★"],
              [bp5, setBp5, "5★"],
              [bp6, setBp6, "6★"],
            ]
              .slice(0, maxStars)
              .map(([v, s, label]) => (
                <Field
                  key={label as string}
                  label={label as string}
                  v={v as string}
                  s={s as (x: string) => void}
                />
              ))}
          </div>
        </section>

        <section className="StatsBlock">
          <h3 className="StatsBlockTitle">Stock</h3>
          <StatBlockFields
            block={stock}
            setter={setStock}
            update={updateBlock}
          />
        </section>

        {maxBlocks.slice(0, maxStars).map((block, i) => (
          <section key={STAR_KEYS[i]} className="StatsBlock">
            <h3 className="StatsBlockTitle">
              Max {STAR_LABELS[i]}
              {i + 1 === maxStars ? " (Gold Max)" : ""}
            </h3>
            <StatBlockFields
              block={block}
              setter={maxSetters[i]}
              update={updateBlock}
            />
          </section>
        ))}

        <section className="StatsBlock">
          <h3 className="StatsBlockTitle">Gold</h3>
          <StatBlockFields
            block={gold}
            setter={setGold}
            update={updateBlock}
          />
        </section>
      </div>

      {applied && (
        <p className="CarDataFormMsg CarDataFormMsg--ok">
          ✓ Stats staged — click Submit Changes when ready.
        </p>
      )}

      <div className="CarDataFormRow">
        <button
          type="button"
          onClick={apply}
          disabled={disabled || !anyValue}
        >
          Apply stats to selected
        </button>
      </div>
    </div>
  );
}

function StatBlockFields({
  block,
  setter,
  update,
}: {
  block: StatBlockState;
  setter: React.Dispatch<React.SetStateAction<StatBlockState>>;
  update: (
    setter: React.Dispatch<React.SetStateAction<StatBlockState>>,
    field: keyof StatBlockState,
    value: string
  ) => void;
}) {
  return (
    <div className="StatsGrid StatsGrid--nitroCenter">
      <Field
        label="Rank"
        v={block.rank}
        s={(v) => update(setter, "rank", v)}
      />
      <Field
        label="Top Speed"
        v={block.topSpeed}
        s={(v) => update(setter, "topSpeed", v)}
      />
      <Field
        label="Acceleration"
        v={block.accel}
        s={(v) => update(setter, "accel", v)}
      />
      <Field
        label="Handling"
        v={block.handling}
        s={(v) => update(setter, "handling", v)}
      />
      <div className="StatsNitro">
        <Field
          label="Nitro"
          v={block.nitro}
          s={(v) => update(setter, "nitro", v)}
        />
      </div>
    </div>
  );
}

function Field({
  label,
  v,
  s,
}: {
  label: string;
  v: string;
  s: (x: string) => void;
}) {
  return (
    <label className="CarDataFormLabel">
      {label}
      <input
        value={v}
        onChange={(e) => s(e.target.value)}
        inputMode="decimal"
      />
    </label>
  );
}