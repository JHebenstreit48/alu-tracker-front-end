import { Link } from "react-router-dom";
import StarRank from "@/components/CarInformation/CarDetails/OtherComponents/StarRank";

interface Car {
  _id: string;
  Brand: string;
  Model: string;
  Stars: number;
}

interface ClassTablesProps {
  cars: Car[];
  selectedClass: string;
  loading: boolean;
  trackerMode?: boolean;
}

export default function ClassTables({
  cars,
  selectedClass,
  loading,
  trackerMode = false,
}: ClassTablesProps) {
  const headerText =
    selectedClass === "All Classes" ? "All Classes" : selectedClass;

  return (
    <div>
      
      <table>
        <tbody>
          <tr>
            <th className="table-header" colSpan={2}>
              {headerText}
            </th>
          </tr>
          <tr className="table-data">
            <td>Manufacturer & Model</td>
            <td>Star Rank</td>
          </tr>

          {loading || cars.length === 0 ? (
            <tr>
              <td colSpan={2}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "6rem",
                  }}
                >
                  <div className="loadingSpinner"></div>
                </div>
              </td>
            </tr>
          ) : (
            cars.map((car) => (
              <tr className="table-data" key={car._id}>
                <td className="car-name">
                <Link to={`/cars/${car._id}`} state={{ trackerMode }}>
                    {car.Brand} {car.Model}
                  </Link>
                </td>
                <td>
                  <StarRank count={car.Stars} />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
