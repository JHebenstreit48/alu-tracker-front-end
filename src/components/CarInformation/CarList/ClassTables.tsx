import { Link } from 'react-router-dom';
import StarRank from '@/components/CarInformation/CarDetails/OtherComponents/StarRank';
import { generateCarKey } from '@/components/CarInformation/CarDetails/Miscellaneous/StorageUtils';

interface Car {
  Brand: string;
  Model: string;
  Stars: number;
  Image?: string;
  ImageStatus?: 'Coming Soon' | 'Available' | 'Removed';
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
  const headerText = selectedClass === 'All Classes' ? 'All Classes' : selectedClass;

  return (
    <div>
      <table>
        <tbody>
          <tr className="tableHeaderRow">
            <th
              className="tableHeader"
              colSpan={2}
            >
              {headerText}
            </th>
          </tr>
          <tr className="headings">
            <th className="tableHeaders">Manufacturer & Model</th>
            <th className="tableHeaders">Image/StarRank</th>
          </tr>

          {loading || cars.length === 0 ? (
            <tr>
              <td colSpan={2}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '6rem',
                  }}
                >
                  <div className="loadingSpinner"></div>
                </div>
              </td>
            </tr>
          ) : (
            cars.map((car) => {
              const carKey = generateCarKey(car.Brand, car.Model);
              const imageSrc = car.Image
                ? `${import.meta.env.VITE_API_BASE_URL}${car.Image}`
                : null;
              const altText = `${car.Brand} ${car.Model}`;

              console.log(car.Model, car.Image, car.ImageStatus);
              return (
                <tr
                  className="tableData"
                  key={carKey}
                >
                  <td className="carName">
                    <Link
                      to={`/cars/${carKey}`}
                      state={{ trackerMode }}
                    >
                      {car.Brand} {car.Model}
                    </Link>
                  </td>

                  <td className="carImage">
                    <div className="imageWrapper">
                      {car.ImageStatus === 'Removed' ? (
                        <span className="noImage">🚫 Removed from Game</span>
                      ) : car.ImageStatus === 'Coming Soon' ? (
                        <span className="noImage">🚧 Image Coming Soon</span>
                      ) : car.Image ? (
                        <>
                          <img
                            className="carPic"
                            src={imageSrc!}
                            alt={altText}
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              e.currentTarget.parentElement!.innerHTML =
                                '<span class="noImage">❌ File Not Found</span>';
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
