import { Link } from "react-router-dom";
import { generateCarKey } from "@/utils/shared/StorageUtils";
import LoadingSpinner from "@/components/Shared/Loading/LoadingSpinner";
import OwnedGoldHighlighter from "@/components/Cars/ClassTables/OwnedGoldHighlighter";
import { FavoriteHeart } from "@/components/Shared/CarsAndBrands";
import { CarImageCell } from "@/components/Cars/ClassTables/CarImageCell";
import { useCarListTracking } from "@/hooks/Cars/useCarListTracking";
import type { ClassTablesProps } from "@/types/Cars/ClassTables";

export default function ClassTables({
  cars,
  selectedClass,
  loading,
  trackerMode = false,
}: ClassTablesProps) {
  const headerText =
    selectedClass === "All Classes" ? "All Classes" : selectedClass;

  const { trackingEnabled, getTrackingForKey } = useCarListTracking();

  return (
    <div>
      <table>
        <tbody>
          <tr className="tableHeaderRow">
            <th className="tableHeader" colSpan={2}>
              {headerText}
            </th>
          </tr>

          <tr className="headings">
            <th className="tableHeaders">Manufacturer &amp; Model</th>
            <th className="tableHeaders">Image/StarRank</th>
          </tr>

          {loading || cars.length === 0 ? (
            <tr>
              <td colSpan={2}>
                <LoadingSpinner message="Cataloging all speed machines..." />
              </td>
            </tr>
          ) : (
            cars.map((car) => {
              const carKey = generateCarKey(car.brand, car.model);
              const tracking = getTrackingForKey(carKey);

              return (
                <tr className="tableData" key={carKey}>
                  <OwnedGoldHighlighter carKey={carKey}>
                    <div className="carCell">
                      <Link to={`/cars/${carKey}`} state={{ trackerMode }}>
                        {car.brand} {car.model}
                      </Link>
                      <FavoriteHeart carKey={carKey} />
                    </div>
                  </OwnedGoldHighlighter>

                  <td className="carImage">
                    <div className="imageWrapper">
                      <CarImageCell
                        car={car}
                        carKey={carKey}
                        trackingEnabled={trackingEnabled}
                        tracking={tracking}
                      />
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}