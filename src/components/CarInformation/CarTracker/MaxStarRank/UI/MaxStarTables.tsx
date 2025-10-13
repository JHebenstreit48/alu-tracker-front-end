interface MaxStarTableProps {
    rank: 3 | 4 | 5 | 6;
    owned: number;
    inProgress: number;
    maxed: number;
    totalInGame: number;
    percentMaxed: number;
  }
  
  const backendBaseUrl = import.meta.env.VITE_API_BASE_URL;
  
  export default function MaxStarTables({
    rank,
    owned,
    inProgress,
    maxed,
    totalInGame,
    percentMaxed,
  }: MaxStarTableProps) {
    const starIcons = Array.from({ length: rank }, (_, i) => (
      <img
        key={i}
        src={`${backendBaseUrl}/images/icons/star.png`}
        alt="Star"
        className="inlineStar"
        style={{
          width: "20px",
          height: "20px",
          marginRight: "2px",
        }}
      />
    ));
  
    return (
      <div className="maxStarTableWrapper">
        <table className="maxStarTable">
          <thead>
            <tr>
              <th colSpan={2} style={{ textAlign: "center", paddingBottom: "0.5rem" }}>
                <div className="starRow">{starIcons}</div>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Owned</td>
              <td>{owned}</td>
            </tr>
            <tr>
              <td>In Progress</td>
              <td>{inProgress}</td>
            </tr>
            <tr>
              <td>Maxed</td>
              <td>{maxed}</td>
            </tr>
            <tr>
              <td>Total Cars</td>
              <td>{totalInGame}</td>
            </tr>
            <tr>
              <td>% Maxed</td>
              <td>{percentMaxed.toFixed(1)}%</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }