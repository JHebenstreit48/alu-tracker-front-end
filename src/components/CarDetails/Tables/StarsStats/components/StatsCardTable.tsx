import type { StatSnapshot } from "@/utils/CarDetails/format";
import { fmt, makeSpeedConverter } from "@/utils/CarDetails/format";

type Props = {
  title: React.ReactNode;
  stats: StatSnapshot;
  unitPreference: "metric" | "imperial";
  density?: "compact" | "regular";
  className?: string; // one hook to style all stats cards later
};

export default function StatsTable({
  title,
  stats,
  unitPreference,
  density = "compact",
  className = "statsTableCard",
}: Props) {
  const toSpeed = makeSpeedConverter(unitPreference);

  return (
    <div className={`tableCard tableCard--${density} ${className}`.trim()}>
      <table className={`carInfoTable carInfoTable--${density}`}>
        <thead>
          <tr>
            <th className="tableHeader2" colSpan={2}>
              {title}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr><td>Rank</td><td>{fmt(stats.rank, 0)}</td></tr>
          <tr><td>Top Speed</td><td>{toSpeed(stats.topSpeed)}</td></tr>
          <tr><td>Acceleration</td><td>{fmt(stats.acceleration)}</td></tr>
          <tr><td>Handling</td><td>{fmt(stats.handling)}</td></tr>
          <tr><td>Nitro</td><td>{fmt(stats.nitro)}</td></tr>
        </tbody>
      </table>
    </div>
  );
}