import {
  Bar,
  BarChart,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { StarRankOwnershipDatum } from '@/types/Tracking/starRankStats';

interface Props {
  data: StarRankOwnershipDatum[];
}

export default function StarRankOwnershipChart({ data }: Props) {
  // ======== Build a "nice" Y-axis scale based on data =========
  const maxTotal =
    data.length > 0
      ? Math.max(...data.map((d) => d.owned + d.unowned))
      : 0;

  // Round up to a "nice" max (nearest 10)
  const niceMax =
    maxTotal > 0 ? Math.ceil(maxTotal / 10) * 10 : 10;

  // Aim for ~5 steps, then round step size to a "nice" power-of-10 multiple
  const roughStep = niceMax / 5;
  const magnitude =
    roughStep > 0 ? Math.pow(10, Math.floor(Math.log10(roughStep))) : 10;
  const step = Math.max(
    magnitude,
    Math.ceil(roughStep / magnitude) * magnitude
  );

  const ticks: number[] = [];
  for (let v = 0; v <= niceMax; v += step) {
    ticks.push(v);
  }

  return (
    <div className="starRankOwnershipChart">
      <h3 className="sectionSubtitle">
        Owned vs Unowned by Max Star Rank
      </h3>
      <div className="chartContainer">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 12, right: 16, left: 0, bottom: 8 }}
          >
            <XAxis
              dataKey="starRank"
              tickFormatter={(val) => `${val}★`}
            />
            <YAxis
              domain={[0, niceMax]}
              ticks={ticks}
              allowDecimals={false}
            />
            <Tooltip
              formatter={(value: number) => [value, 'Cars']}
              labelFormatter={(label: number) => `${label}★ Max Rank`}
            />
            <Legend />
            <Bar
              dataKey="owned"
              name="Owned"
              fill="#ffd700"
              isAnimationActive={false}
            />
            <Bar
              dataKey="unowned"
              name="Unowned / Not at Rank"
              fill="#444444"
              isAnimationActive={false}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}