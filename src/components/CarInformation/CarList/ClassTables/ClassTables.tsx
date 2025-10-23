import { Link } from "react-router-dom";
import StarRank from "@/components/Shared/Stars/StarRank";
import { generateCarKey } from "@/components/CarInformation/CarDetails/Miscellaneous/StorageUtils";
import LoadingSpinner from "@/components/Shared/Loading/LoadingSpinner";
import OwnedGoldHighlighter from "@/components/CarInformation/CarList/ClassTables/OwnedGoldHighlighter";
import { FavoriteHeart } from "@/components/Shared/CarsAndBrands";

interface Car {
  Brand: string;
  Model: string;
  Stars: number;
  Image?: string;
  ImageStatus?: "Coming Soon" | "Available" | "Removed";
}

interface ClassTablesProps {
  cars: Car[];
  selectedClass: string;
  loading: boolean;
  trackerMode?: boolean;
}

const FALLBACK =
  `${import.meta.env.VITE_IMG_CDN_BASE ?? "https://alu-tracker-image-vault.onrender.com"}/images/fallbacks/car-missing.jpg`;

export default function ClassTables({
  cars,
  selectedClass,
  loading,
  trackerMode = false,
}: ClassTablesProps) {
  const headerText = selectedClass === "All Classes" ? "All Classes" : selectedClass;

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
              const carKey = generateCarKey(car.Brand, car.Model);
              const imageSrc = car.Image ?? null;
              const altText = `${car.Brand} ${car.Model}`;

              return (
                <tr className="tableData" key={carKey}>
                  <OwnedGoldHighlighter carKey={carKey}>
                    <div className="carCell">
                      <Link to={`/cars/${carKey}`} state={{ trackerMode }}>
                        {car.Brand} {car.Model}
                      </Link>
                      <FavoriteHeart carKey={carKey} />
                    </div>
                  </OwnedGoldHighlighter>

                  <td className="carImage">
                    <div className="imageWrapper">
                      {car.ImageStatus === "Removed" ? (
                        <span className="noImage">🚫 Removed from Game</span>
                      ) : car.ImageStatus === "Coming Soon" ? (
                        <span className="noImage">🚧 Image Coming Soon</span>
                      ) : imageSrc ? (
                        <>
                          <img
                            className="carPic"
                            src={imageSrc}
                            alt={altText}
                            onError={(e) => {
                              const img = e.currentTarget as HTMLImageElement;
                              if (img.src !== FALLBACK) {
                                img.src = FALLBACK;
                              } else {
                                img.style.display = "none";
                                if (img.parentElement) {
                                  img.parentElement.innerHTML =
                                    '<span class="noImage">❌ File Not Found</span>';
                                }
                              }
                            }}
                          />
                          <div className="starOverlay">
                            <StarRank count={car.Stars} />
                          </div>
                        </>
                      ) : (
                        <span className="noImage">❓ Unknown</span>
                      )}
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