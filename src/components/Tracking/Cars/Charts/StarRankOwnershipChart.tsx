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
    return (
      <div className="starRankOwnershipChart">
        <h3 className="sectionSubtitle">Ownership by Current Star Rank</h3>
        <div className="chartContainer">
          {/* height is now 100% → SCSS controls the actual size */}
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 12, right: 16, left: 0, bottom: 8 }}
            >
              <XAxis
                dataKey="starRank"
                tickFormatter={(val) => `${val}★`}
              />
              <YAxis />
              <Tooltip
                formatter={(value: number) => [value, 'Cars']}
                labelFormatter={(label: number) => `${label}★ Rank`}
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