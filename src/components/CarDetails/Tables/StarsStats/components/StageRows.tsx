import { Fragment } from "react";
import type { StageSnapshot } from "@/types/shared/car";

type Props = {
  stages?: StageSnapshot[];
  toSpeed: (v: unknown) => string;
  expectedCount?: number;
};

export default function StageRows({ stages, toSpeed, expectedCount }: Props) {
  if (!stages || stages.length === 0) return null;

  return (
    <>
      <tr>
        <td colSpan={2} className="subheader">
          Stages{" "}
          {typeof expectedCount === "number"
            ? `(${stages.length} of ${expectedCount})`
            : `(${stages.length})`}
        </td>
      </tr>

      {stages.map((s) => (
        <Fragment key={s.stage}>
          <tr><td>Stage</td><td>{s.stage}</td></tr>
          {typeof s.rank === "number" && <tr><td>Rank</td><td>{s.rank}</td></tr>}
          {typeof s.topSpeed === "number" && (
            <tr><td>Top Speed</td><td>{toSpeed(s.topSpeed)}</td></tr>
          )}
          {typeof s.acceleration === "number" && (
            <tr><td>Acceleration</td><td>{s.acceleration.toFixed(2)}</td></tr>
          )}
          {typeof s.handling === "number" && (
            <tr><td>Handling</td><td>{s.handling.toFixed(2)}</td></tr>
          )}
          {typeof s.nitro === "number" && (
            <tr><td>Nitro</td><td>{s.nitro.toFixed(2)}</td></tr>
          )}
          <tr className="row-spacer"><td colSpan={2} /></tr>
        </Fragment>
      ))}
    </>
  );
}