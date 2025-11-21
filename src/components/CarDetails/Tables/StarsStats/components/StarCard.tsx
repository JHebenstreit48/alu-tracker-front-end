import type { StatSnapshot } from "@/components/CarDetails/Tables/StarsStats/utils/format";
import { fmt } from "@/components/CarDetails/Tables/StarsStats/utils/format";

export default function StarCard({
  star,
  header,
  stats,
  toSpeed,
  children,
}: {
  star: number;
  header: React.ReactNode;
  stats: StatSnapshot;
  toSpeed: (v: unknown) => string;
  children?: React.ReactNode;
}) {
  return (
    <div className="tableCard" data-star={star}>
      <table className="carInfoTable">
        <thead>
          <tr>
            <th className="tableHeader2" colSpan={2}>
              {header}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr><td>Rank</td><td>{fmt(stats.rank, 0)}</td></tr>
          <tr><td>Top Speed</td><td>{toSpeed(stats.topSpeed)}</td></tr>
          <tr><td>Acceleration</td><td>{fmt(stats.acceleration)}</td></tr>
          <tr><td>Handling</td><td>{fmt(stats.handling)}</td></tr>
          <tr><td>Nitro</td><td>{fmt(stats.nitro)}</td></tr>
          {children}
        </tbody>
      </table>
    </div>
  );
}