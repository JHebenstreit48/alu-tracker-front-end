import PageTab from '@/components/Shared/Navigation/PageTab';
import Header from '@/components/Shared/HeaderFooter/Header';
import {
  DetailHeader,
  TablesGrid,
  CarImage,
  CommentsPanel,
  CarTrackerToggle,
} from '@/components/CarDetails/Sections';

import { useCarDetailsPage } from '@/hooks/CarDetails/useCarDetailsPage';
import { useTrackerMode } from '@/hooks/shared/useTrackerMode';
import useKeyObtained from '@/hooks/CarDetails/useKeyObtained';
import { useAutoSyncDependency } from '@/hooks/UserDataSync/useAutoSync';
import usePreferredUnit from '@/hooks/CarDetails/usePreferredUnit';
import UnitToggle from '@/components/CarDetails/OtherComponents/UnitToggle';

interface Props {
  slug: string;
}

export default function CarDetailsBody({ slug }: Props) {
  const { car, status, error, keyObtained, setKeyObtained, goBack } = useCarDetailsPage(slug);

  const { trackerMode, toggleTrackerMode } = useTrackerMode();
  const { unit, setUnit } = usePreferredUnit();

  const handleKeyObtainedChange = useKeyObtained(car, setKeyObtained);
  useAutoSyncDependency([keyObtained, trackerMode, car?.brand, car?.model]);

  const carTitle = car ? `${car.brand} ${car.model}` : 'Car Details';
  const pageTabTitle = car ? `${car.brand} ${car.model}` : 'Car Details';

  return (
    <div className="carDetail">
      <PageTab title={pageTabTitle}>
        <Header
          text="Car Details"
          className="carDetailsHeader"
        />

        {car && (
          <>
            <div className="toolsRow">
              <CarTrackerToggle
                isEnabled={trackerMode}
                onToggle={toggleTrackerMode}
              />
              <h1 className="CarDetailTitle">{carTitle}</h1>
              <UnitToggle
                value={unit}
                onChange={setUnit}
              />
            </div>
          </>
        )}

        <DetailHeader
          onBack={goBack}
          updatedAt={car?.updatedAt}
          status={status}
        />

        {error ? (
          <div className="error-message">
            <h2>⚠️ Could not load this car&apos;s details.</h2>
            <p>The car may not exist or an error occurred while fetching.</p>
            <button
              onClick={goBack}
              className="backBtn"
            >
              Back to Car List
            </button>
          </div>
        ) : car ? (
          <>
            <CarImage car={car} />
            <TablesGrid
              car={car}
              trackerMode={trackerMode}
              keyObtained={keyObtained}
              onKeyObtainedChange={handleKeyObtainedChange}
              unitPreference={unit}
            />
            <hr className="content-divider" />
            <CommentsPanel
              normalizedKey={slug}
              brand={car.brand}
              model={car.model}
            />
          </>
        ) : (
          <div className="loading-message">Loading car details...</div>
        )}
      </PageTab>
    </div>
  );
}