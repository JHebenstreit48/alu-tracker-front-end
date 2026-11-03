import type { StatRow } from '@/types/CarLab/compare';
import { STAT_LABELS, formatDelta, formatStat } from '@/utils/carLab/values';

interface Props {
  nameA: string;
  nameB: string;
  pointLabel: string;
  rows: StatRow[];
}

export default function ResultsTable({ nameA, nameB, pointLabel, rows }: Props) {
  return (
    <section>
      <h3 className="carLabResultsTitle">Results</h3>
      <p className="carLabResultsFor">At: {pointLabel}</p>
      <div className="carLabTableWrap">
        <table className="carLabTable">
          <thead>
            <tr>
              <th scope="col">Stat</th>
              <th scope="col" className="colA">
                {nameA}
              </th>
              <th scope="col" className="colB">
                {nameB}
              </th>
              <th scope="col">A − B</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.key}>
                <th scope="row">{STAT_LABELS[row.key]}</th>
                <td className="colA">
                  {row.leader === 'a' ? (
                    <strong>{formatStat(row.key, row.a)}</strong>
                  ) : (
                    formatStat(row.key, row.a)
                  )}
                </td>
                <td className="colB">
                  {row.leader === 'b' ? (
                    <strong>{formatStat(row.key, row.b)}</strong>
                  ) : (
                    formatStat(row.key, row.b)
                  )}
                </td>
                <td>{formatDelta(row.key, row.delta)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}