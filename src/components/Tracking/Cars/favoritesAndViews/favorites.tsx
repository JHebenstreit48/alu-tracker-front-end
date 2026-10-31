import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useCarAPI } from '@/hooks/Cars';
import { useLocalFavorites } from '@/hooks/Tracking/useLocalFavorites';
import { generateCarKey } from '@/utils/shared/StorageUtils';

export default function Favorites() {
  const { cars, loading } = useCarAPI('All Classes');
  const favoriteKeys = useLocalFavorites();

  const favoriteCars = useMemo(
    () =>
      cars
        .map((car) => ({ car, carKey: generateCarKey(car.brand, car.model) }))
        .filter(({ carKey }) => favoriteKeys.has(carKey))
        .sort((a, b) =>
          `${a.car.brand} ${a.car.model}`.localeCompare(`${b.car.brand} ${b.car.model}`)
        ),
    [cars, favoriteKeys]
  );

  return (
    <section className="favoritesSection">
      <hr className="sectionRule" />
      <h2 className="carCollectionTitle">Favorites</h2>
      <hr className="sectionRule" />

      {loading ? (
        <p className="favoritesMessage">Loading favorites…</p>
      ) : favoriteCars.length === 0 ? (
        <p className="favoritesMessage">No favorites yet. Tap ♡ next to any car on the Cars page.</p>
      ) : (
        <>
          <p className="favoritesCount">
            {favoriteCars.length} favorite{favoriteCars.length === 1 ? '' : 's'}
          </p>

          <table className="favoritesTable">
            <thead>
              <tr>
                <th>Car</th>
                <th>
                  <span className="labelDesktop">Class</span>
                  <span className="labelMobile">Details</span>
                </th>
                <th>Rarity</th>
                <th>Stars</th>
              </tr>
            </thead>
            <tbody>
              {favoriteCars.map(({ car, carKey }) => (
                <tr key={carKey}>
                  <td className="favoritesName">
                    <Link to={`/cars/${car.normalizedKey ?? carKey}`}>
                      {car.brand} {car.model}
                    </Link>
                  </td>
                  <td className="favoritesClass">{car.class ?? '—'}</td>
                  <td className={`favoritesRarity rarity${car.rarity ?? ''}`}>{car.rarity ?? '—'}</td>
                  <td className="favoritesStars">{'★'.repeat(car.stars ?? 0)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </section>
  );
}