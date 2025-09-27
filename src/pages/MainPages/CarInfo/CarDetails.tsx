import { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';

import PageTab from '@/components/Shared/PageTab';
import Header from '@/components/Shared/Header';

import { Car, Blueprints } from '@/components/CarInformation/CarDetails/Miscellaneous/Interfaces';
import { StockStats } from '@/components/CarInformation/CarDetails/Miscellaneous/Interfaces/StarStats/StockStats';
import { GoldMaxStats } from '@/components/CarInformation/CarDetails/Miscellaneous/Interfaces/StarStats/GoldMaxStats';
import { MaxStarStats } from '@/components/CarInformation/CarDetails/Miscellaneous/Interfaces/StarStats/MaxStarStats';
import { useAutoSyncDependency } from '@/components/CarInformation/UserDataSync/hooks/useAutoSync';

import CarDataStatusCard from '@/components/CarInformation/CarDetails/OtherComponents/DataStatusCard';
import CarImage from '@/components/CarInformation/CarDetails/OtherComponents/CarImage';
import ClassRank from '@/components/CarInformation/CarDetails/Tables/ClassRank';
import StockStatsTable from '@/components/CarInformation/CarDetails/Tables/StockStats';
import MaxStarStatsTable from '@/components/CarInformation/CarDetails/Tables/MaxStarStats';
import GoldMaxStatsTable from '@/components/CarInformation/CarDetails/Tables/GoldMaxStats';
import BlueprintsTable from '@/components/CarInformation/CarDetails/Tables/BlueprintsTable';
import KeyInfo from '@/components/CarInformation/CarDetails/Tables/KeyInfo';
import CommentsPanel from '@/components/CarInformation/CarDetails/OtherComponents/Comments/Panel';

import {
  getCarTrackingData,
  setCarTrackingData,
  generateCarKey,
  normalizeString,
} from '@/components/CarInformation/CarDetails/Miscellaneous/StorageUtils';

import '@/scss/Cars/CarDetail.scss';
import '@/scss/Cars/CarStatus.scss';

type CarStatus = {
  status: 'complete' | 'in progress' | 'missing' | 'unknown';
  message?: string;
  lastChecked?: string | null;
};

type FullCar = Car &
  GoldMaxStats &
  Blueprints &
  StockStats &
  MaxStarStats & {
    updatedAt?: string;
    _status?: CarStatus | null;
  };

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'https://alutracker-api.onrender.com';

const CarDetails = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [car, setCar] = useState<FullCar | null>(null);
  const [status, setStatus] = useState<CarStatus | null>(null);
  const [error, setError] = useState(false);
  const [keyObtained, setKeyObtained] = useState(false);
  const [trackerMode, setTrackerMode] = useState(false);

  const unitPreference =
    localStorage.getItem('preferredUnit') === 'imperial' ? 'imperial' : 'metric';

  useEffect(() => {
    const stored = localStorage.getItem('trackerMode') === 'true';
    setTrackerMode(stored);
  }, [location]);

  useEffect(() => {
    if (!slug) return;

    const normalizedSlug = normalizeString(slug);

    if (slug !== normalizedSlug) {
      navigate(`/cars/${normalizedSlug}`, { replace: true });
      return;
    }

    const fetchCarDetails = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/cars/detail/${normalizedSlug}`);
        if (!res.ok) throw new Error(`API error: ${res.status}`);

        const data: FullCar = await res.json();
        setCar(data);

        // 2) Fetch status (separate collection)
        try {
          const sRes = await fetch(`${API_BASE_URL}/api/status/by-slug/${normalizedSlug}`);
          if (sRes.ok) {
            const s = await sRes.json();
            setStatus({
              status: s.status,
              message: s.message,
              lastChecked: s.updatedAt ?? s.createdAt ?? null,
            });
          } else {
            setStatus(null);
          }
        } catch {
          setStatus(null);
        }

        const key = generateCarKey(data.Brand, data.Model);
        const stored = getCarTrackingData(key);

        if (trackerMode && data.KeyCar && stored.stars === undefined) {
          const updated = { ...stored, stars: 1 };
          setCarTrackingData(key, updated);
        }

        if (stored?.keyObtained !== undefined) {
          setKeyObtained(stored.keyObtained);
        }

        setError(false);
      } catch (err) {
        console.error('❌ Failed to fetch car by slug:', err);
        setError(true);
      }
    };

    fetchCarDetails();
  }, [slug, trackerMode, navigate]);

  useAutoSyncDependency([car, keyObtained, trackerMode]);

  const handleGoBack = () => {
    const lastSelectedClass = location.state?.selectedClass;
    const trackerState = trackerMode ? { trackerMode: true } : {};
    navigate(lastSelectedClass ? `/cars?class=${lastSelectedClass}` : '/cars', {
      state: trackerState,
    });
  };

  if (error) {
    return (
      <div className="carDetail">
        <h2 className="error-message">⚠️ Could not load this car's details.</h2>
        <p>The car may not exist or an error occurred while fetching.</p>
        <button
          onClick={handleGoBack}
          className="backBtn"
        >
          Back to Car List
        </button>
      </div>
    );
  }

  if (!car) return <div className="loading-message">Loading car details...</div>;

  return (
    <div className="carDetail">
      <PageTab title={`${car.Brand} ${car.Model}`}>
        <Header text={`${car.Brand} ${car.Model}`} />

        <div className="cdetail-top">
          <button
            className="backBtn"
            onClick={handleGoBack}
          >
            Back
          </button>

          <div className="cdetail-status">
            <CarDataStatusCard
              updatedAt={car.updatedAt}
              status={status}
              inline
            />
          </div>
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
            <ClassRank
              car={car}
              trackerMode={trackerMode}
              forceOwned={car.KeyCar && keyObtained}
            />
          </div>
          <div className="tableCard">
            <BlueprintsTable
              car={car}
              trackerMode={trackerMode}
            />
          </div>
          <div className="tableCard">
            <StockStatsTable
              car={car}
              unitPreference={unitPreference}
              trackerMode={trackerMode}
            />
          </div>
          <MaxStarStatsTable
            car={car}
            unitPreference={unitPreference}
            trackerMode={trackerMode}
          />
          <div className="tableCard">
            <GoldMaxStatsTable
              car={car}
              unitPreference={unitPreference}
              trackerMode={trackerMode}
            />
          </div>
        </div>

        {/* clean divider before comments */}
        <hr className="content-divider" />

        <CommentsPanel
          normalizedKey={slug!} // slug is normalized by redirect above
          brand={car.Brand}
          model={car.Model}
        />
      </PageTab>
    </div>
  );
};

export default CarDetails;