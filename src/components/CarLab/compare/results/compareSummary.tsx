import type { Verdict } from '@/types/CarLab/compare';

interface Props {
  verdict: Verdict;
}

export default function CompareSummary({ verdict }: Props) {
  return (
    <section>
      <h3 className="carLabResultsTitle">Which is better?</h3>
      {verdict.lines.length === 0 ? (
        <p className="carLabResultsNote">
          These two cars have no checkpoint in common yet (stock, a star level, or gold max).
        </p>
      ) : (
        <ul className="carLabSummary">
          {verdict.lines.map((line) => (
            <li key={line}>{line}</li>
          ))}
          {verdict.overall && (
            <li>
              <strong>{verdict.overall}</strong>
            </li>
          )}
        </ul>
      )}
      {verdict.notes.length > 0 && (
        <ul className="carLabNotes">
          {verdict.notes.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
      )}
    </section>
  );
}