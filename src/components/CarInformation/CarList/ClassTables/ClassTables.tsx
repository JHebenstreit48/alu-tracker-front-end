import { Link } from 'react-router-dom';
import StarRank from '@/components/Shared/Stars/StarRank';
import { generateCarKey } from '@/components/CarInformation/CarDetails/Miscellaneous/StorageUtils';
import LoadingSpinner from '@/components/Shared/LoadingSpinner';

interface Car {
  Brand: string;
  Model: string;
  Stars: number;
  Image?: string; // absolute URL now
  ImageStatus?: 'Coming Soon' | 'Available' | 'Removed';
}

interface ClassTablesProps {
  cars: Car[];
  selectedClass: string;
  loading: boolean;
  trackerMode?: boolean;
}

// Optional fallback hosted on your Image Vault (add later when ready)
const FALLBACK =
  `${import.meta.env.VITE_IMG_CDN_BASE ?? 'https://alu-tracker-image-vault.onrender.com'}/images/fallbacks/car-missing.jpg`;

export default function ClassTables({
  cars,
  selectedClass,
  loading,
  trackerMode = false,
}: ClassTablesProps) {
  const headerText = selectedClass === 'All Classes' ? 'All Classes' : selectedClass;

  return (
    <div>
      <table>
        <tbody>
          <tr className="tableHeaderRow">
            <th className="tableHeader" colSpan={2}>{headerText}</th>
          </tr>
          <tr className="headings">
            <th className="tableHeaders">Manufacturer & Model</th>
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
              const imageSrc = car.Image ?? null; // already absolute from hook/backend
              const altText = `${car.Brand} ${car.Model}`;

              return (
                <tr className="tableData" key={carKey}>
                  <td className="carName">
                    <Link to={`/cars/${carKey}`} state={{ trackerMode }}>
                      {car.Brand} {car.Model}
                    </Link>
                  </td>

                  <td className="carImage">
                    <div className="imageWrapper">
                      {car.ImageStatus === 'Removed' ? (
                        <span className="noImage">🚫 Removed from Game</span>
                      ) : car.ImageStatus === 'Coming Soon' ? (
                        <span className="noImage">🚧 Image Coming Soon</span>
                      ) : imageSrc ? (
                        <>
                          <img
                            className="carPic"
                            src={imageSrc}
                            alt={altText}
                            onError={(e) => {
                              const img = e.currentTarget as HTMLImageElement;
                              // Try fallback once; if that fails, show text
                              if (img.src !== FALLBACK) {
                                img.src = FALLBACK;
                              } else {
                                img.style.display = 'none';
                                img.parentElement!.innerHTML =
                                  '<span class="noImage">❌ File Not Found</span>';
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