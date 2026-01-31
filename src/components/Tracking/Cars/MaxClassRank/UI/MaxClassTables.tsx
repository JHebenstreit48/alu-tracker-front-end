interface Props {
  carClass: "D" | "C" | "B" | "A" | "S";
  owned: number;
  inProgress: number;
  maxed: number;
  totalInGame: number;
  percentMaxed: number;
}

export default function MaxClassTables({
  carClass,
  owned,
  inProgress,
  maxed,
  totalInGame,
  percentMaxed,
}: Props) {
  return (
    <table className="maxClassTable">
      <thead>
        <tr>
          <th colSpan={2}>{carClass} Class</th>
        </tr>
      </thead>

      <tbody>
        <tr><td>Owned</td><td>{owned}</td></tr>
        <tr><td>Not Max Rank</td><td>{inProgress}</td></tr>
        <tr><td>Maxed</td><td>{maxed}</td></tr>
        <tr><td>Total Cars</td><td>{totalInGame}</td></tr>
        <tr><td>% Maxed</td><td>{percentMaxed.toFixed(1)}%</td></tr>
      </tbody>
    </table>
  );
}