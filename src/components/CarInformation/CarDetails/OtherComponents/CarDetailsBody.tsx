import PageTab from "@/components/Shared/PageTab";
import Header from "@/components/Shared/Header";
import {
  DetailHeader,
  TablesGrid,
  CarImage,
  CommentsPanel,
  CarTrackerToggle,
} from "@/components/CarInformation/CarDetails/Sections";

import { useCarDetailsPage } from "@/components/CarInformation/CarDetails/hooks/useCarDetailsPage";
import { useTrackerMode } from "@/components/CarInformation/shared/useTrackerMode";
import { useKeyCarSeeding } from "@/components/CarInformation/CarDetails/hooks/useKeyCarSeeding";
import useKeyObtained from "@/components/CarInformation/CarDetails/hooks/useKeyObtained";
import { useAutoSyncDependency } from "@/components/CarInformation/UserDataSync/hooks/useAutoSync";
import usePreferredUnit from "@/components/CarInformation/CarDetails/hooks/usePreferredUnit";
import UnitToggle from "@/components/CarInformation/CarDetails/OtherComponents/UnitToggle";

import "@/scss/Cars/CarDetails/CarDetail.scss";
import "@/scss/Cars/CarDetails/CarStatus.scss";
import "@/scss/Cars/CarDetails/TrackerToggle.scss";
import "@/scss/Cars/CarDetails/UnitToggle.scss";

interface Props { slug: string; }

export default function CarDetailsBody({ slug }: Props) {
  const { car, status, error, keyObtained, setKeyObtained, goBack } = useCarDetailsPage(slug);
  const { trackerMode, toggleTrackerMode } = useTrackerMode();
  const { unit, setUnit } = usePreferredUnit();

  useKeyCarSeeding(car, trackerMode);
  const handleKeyObtainedChange = useKeyObtained(car, setKeyObtained);
  useAutoSyncDependency([keyObtained, trackerMode, car?.Brand, car?.Model]);

  // Keep the shell mounted; swap inner content only
  const title = car ? `${car.Brand} ${car.Model}` : "Loading…";
  const pageTabTitle = car ? title : "Car Details";

  return (
    <div className="carDetail">
      <PageTab title={pageTabTitle}>
        <Header text={title} />
        <DetailHeader onBack={goBack} updatedAt={car?.updatedAt} status={status} />

        {/* Show controls when data is ready (prevents flashing) */}
        {car && (
          <div className="toolsRow">
            <CarTrackerToggle isEnabled={trackerMode} onToggle={toggleTrackerMode} />
            <UnitToggle value={unit} onChange={setUnit} />
          </div>
        )}

        {/* Main content area: error → details → loading */}
        {error ? (
          <div className="error-message">
            <h2>⚠️ Could not load this car's details.</h2>
            <p>The car may not exist or an error occurred while fetching.</p>
            <button onClick={goBack} className="backBtn">Back to Car List</button>
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
            <CommentsPanel normalizedKey={slug} brand={car.Brand} model={car.Model} />
          </>
        ) : (
          <div className="loading-message">Loading car details...</div>
        )}
      </PageTab>
    </div>
  );
}