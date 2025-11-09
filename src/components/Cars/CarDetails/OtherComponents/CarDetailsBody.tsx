import PageTab from "@/components/Shared/Navigation/PageTab";
import Header from "@/components/Shared/HeaderFooter/Header";
import {
  DetailHeader,
  TablesGrid,
  CarImage,
  CommentsPanel,
  CarTrackerToggle,
} from "@/components/Cars/CarDetails/Sections";

import { useCarDetailsPage } from "@/hooks/CarDetails/useCarDetailsPage";
import { useTrackerMode } from "@/components/Tracking/useTrackerMode";
import { useKeyCarSeeding } from "@/hooks/CarDetails/useKeyCarSeeding";
import useKeyObtained from "@/hooks/CarDetails/useKeyObtained";
import { useAutoSyncDependency } from "@/components/UserDataSync/hooks/useAutoSync";
import usePreferredUnit from "@/hooks/CarDetails/usePreferredUnit";
import UnitToggle from "@/components/Cars/CarDetails/OtherComponents/UnitToggle";

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