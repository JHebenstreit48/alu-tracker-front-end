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

import '@/scss/Cars/CarDetails/CarDetail.scss';
import '@/scss/Cars/CarDetails/CarStatus.scss';
import '@/scss/Cars/CarDetails/UnitToggle.scss';
import '@/scss/Cars/CarDetails/CarComments.scss';

interface Props {
  slug: string;
}

export default function CarDetailsBody({ slug }: Props) {
  const { car, status, error, keyObtained, setKeyObtained, goBack } =
    useCarDetailsPage(slug);

  const { trackerMode, toggleTrackerMode } = useTrackerMode();
  const { unit, setUnit } = usePreferredUnit();

  const handleKeyObtainedChange = useKeyObtained(car, setKeyObtained);
  useAutoSyncDependency([keyObtained, trackerMode, car?.Brand, car?.Model]);

  // Visible title in the page body
  const carTitle = car ? `${car.Brand} ${car.Model}` : 'Car Details';

  // Browser tab text (PageTab controls <title>)
  const pageTabTitle = car ? `${car.Brand} ${car.Model}` : 'Car Details';

  return (
    <div className="carDetail">
      <PageTab title={pageTabTitle}>
        {/* Header bar is now generic & short */}
        <Header
          text="Car Details"
          className="carDetailsHeader"
        />

        {/* Car title + tools sit in the body, under the header bar */}
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

        {/* Detail header row (Back + Last updated) now sits under the tools row + thin line */}
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
            {/* This bottom divider stays */}
            <hr className="content-divider" />
            <CommentsPanel
              normalizedKey={slug}
              brand={car.Brand}
              model={car.Model}
            />
          </>
        ) : (
          <div className="loading-message">Loading car details...</div>
        )}
      </PageTab>
    </div>
  );
}