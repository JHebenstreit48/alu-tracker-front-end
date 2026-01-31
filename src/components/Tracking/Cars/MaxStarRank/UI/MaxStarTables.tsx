import { getImageUrl } from "@/utils/shared/imageUrl";

interface MaxStarTableProps {
  rank: 3 | 4 | 5 | 6;
  owned: number;
  inProgress: number;
  maxed: number;
  totalInGame: number;
  percentMaxed: number;
}

const STAR_ICON_REL_PATH = "/images/icons/star.png";

export default function MaxStarTables({
  rank,
  owned,
  inProgress,
  maxed,
  totalInGame,
  percentMaxed,
}: MaxStarTableProps) {
  const starIconUrl = getImageUrl(STAR_ICON_REL_PATH);

  const starIcons = Array.from({ length: rank }, (_, i) => (
    <img
      key={i}
      src={starIconUrl}
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
            <td>Not Max Rank</td>
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