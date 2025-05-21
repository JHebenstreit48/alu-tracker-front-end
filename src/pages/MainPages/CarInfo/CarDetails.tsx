import { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';

import {
  Car,
  GoldMaxStats,
  Blueprints,
  StockStats,
  OneStarStockStats,
  TwoStarStockStats,
} from '@/components/CarInformation/CarDetails/Miscellaneous/Interfaces';

import CarImage from '@/components/CarInformation/CarDetails/OtherComponents/CarImage';
import ClassRank from '@/components/CarInformation/CarDetails/Tables/ClassRank';
import StockStatsTable from '@/components/CarInformation/CarDetails/Tables/StockStats';
import OneStarStockStatsTable from '@/components/CarInformation/CarDetails/Tables/OneStarMaxStats';
import TwoStarStockStatsTable from '@/components/CarInformation/CarDetails/Tables/TwoStarMaxStats';
import MaxStats from '@/components/CarInformation/CarDetails/Tables/MaxStats';
import BlueprintsTable from '@/components/CarInformation/CarDetails/Tables/BlueprintsTable';
import KeyInfo from '@/components/CarInformation/CarDetails/Tables/KeyInfo';

import {
  getCarTrackingData,
  generateCarKey,
} from '@/components/CarInformation/CarDetails/Miscellaneous/StorageUtils';

import '@/SCSS/Cars/CarDetail.scss';

type FullCar = Car & GoldMaxStats & Blueprints & StockStats & OneStarStockStats & TwoStarStockStats;

const CarDetails = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [car, setCar] = useState<FullCar | null>(null);
  const [error, setError] = useState(false);
  const [keyObtained, setKeyObtained] = useState(false);
  const [trackerMode, setTrackerMode] = useState(false);

  const unitPreference =
    localStorage.getItem('preferredUnit') === 'imperial' ? 'imperial' : 'metric';

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'https://alutracker-api.onrender.com';

  useEffect(() => {
    const stored = localStorage.getItem('trackerMode') === 'true';
    setTrackerMode(stored);
  }, [location]);

  useEffect(() => {
    async function fetchCarDetails(slug: string) {
      try {
        const res = await fetch(`${API_BASE_URL}/api/cars/detail/${slug}`);
        const data = await res.json();
        const allCars: FullCar[] = Array.isArray(data) ? data : data.cars || [];

        const normalizedSlug = slug.toLowerCase();

        let found = false;
        for (const car of allCars) {
          const key = generateCarKey(car.Brand, car.Model);
          if (key === normalizedSlug) {
            setCar(car);
            const stored = getCarTrackingData(key);
            if (stored?.keyObtained !== undefined) {
              setKeyObtained(stored.keyObtained);
            }
            found = true;
            break;
          }
        }

        if (!found) {
          console.error("🧪 No match for slug:", normalizedSlug);
          console.warn("🧪 Valid keys:", allCars.map(c => generateCarKey(c.Brand, c.Model)));
          throw new Error("Car not found");
        }
      } catch (err) {
        console.error("❌ Failed to fetch car by slug:", err);
        setError(true);
      }
    }

    if (slug) {
      fetchCarDetails(slug);
    }
  }, [slug, API_BASE_URL]);

  const handleGoBack = () => {
    const lastSelectedClass = location.state?.selectedClass;
    const trackerState = trackerMode ? { trackerMode: true } : {};
    navigate(lastSelectedClass ? `/cars?class=${lastSelectedClass}` : '/cars', {
      state: trackerState,
    });
  };

  if (error) return <div className="error-message">Failed to load car details.</div>;
  if (!car) return <div className="loading-message">Loading car details...</div>;

  return (
    <div className="carDetail">
      <div>
        <button className="backBtn" onClick={handleGoBack}>Back</button>
      </div>

      <div>
        <h1 className="carName">{car.Brand} {car.Model}</h1>
      </div>

      <CarImage car={car} />

      <KeyInfo
        car={car}
        trackerMode={trackerMode}
        keyObtained={keyObtained}
        onKeyObtainedChange={(obtained) => setKeyObtained(obtained)}
      />

      <div className="carDetailTables">
        <div className="tableCard">
          <ClassRank car={car} trackerMode={trackerMode} forceOwned={car.KeyCar && keyObtained} />
        </div>
        <div className="tableCard">
          <MaxStats car={car} unitPreference={unitPreference} trackerMode={trackerMode} />
        </div>
        <div className="tableCard">
          <BlueprintsTable car={car} trackerMode={trackerMode} />
        </div>
        <div className="tableCard">
          <StockStatsTable car={car} unitPreference={unitPreference} trackerMode={trackerMode} />
        </div>
        <div className="tableCard">
          <OneStarStockStatsTable car={car} unitPreference={unitPreference} trackerMode={trackerMode} />
        </div>
        <div className="tableCard">
          <TwoStarStockStatsTable car={car} unitPreference={unitPreference} trackerMode={trackerMode} />
        </div>
      </div>
    </div>
  );
};

export default CarDetails;
