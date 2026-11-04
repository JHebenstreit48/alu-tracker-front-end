import { Link } from 'react-router-dom';
import type { ViewedCar } from '@/types/Tracking/viewedItems';

type MostViewedCarsProps = {
  cars: ViewedCar[];
};

export default function MostViewedCars({ cars }: MostViewedCarsProps) {
  return (
    <>
      <h3 className="viewsSubTitle">Top Cars</h3>

      <table className="favoritesTable">
        <thead>
          <tr>
            <th>Car</th>
            <th>
              <span className="labelDesktop">Class</span>
              <span className="labelMobile">Details</span>
            </th>
            <th>Rarity</th>
            <th>Views</th>
          </tr>
        </thead>
        <tbody>
          {cars.map(({ car, carKey, views }) => (
            <tr key={carKey}>
              <td className="favoritesName">
                <Link to={`/cars/${car.normalizedKey ?? carKey}`}>
                  {car.brand} {car.model}
                </Link>
              </td>
              <td className="favoritesClass">{car.class ?? '—'}</td>
              <td className={`favoritesRarity rarity${car.rarity ?? ''}`}>{car.rarity ?? '—'}</td>
              <td className="favoritesStars viewsCount">
                {views} view{views === 1 ? '' : 's'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}