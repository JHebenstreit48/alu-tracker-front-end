// src/pages/MainPages/CarInfo/CarDetails.tsx
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
import { useKeyObtainedHandler } from "@/components/CarInformation/CarDetails/hooks/useKeyObtained";
import { useAutoSyncDependency } from "@/components/CarInformation/UserDataSync/hooks/useAutoSync";

import "@/scss/Cars/CarDetail.scss";
import "@/scss/Cars/CarStatus.scss";

export default function CarDetails() {
  const {
    slug,
    car,
    status,
    error,
    keyObtained,
    setKeyObtained,
    unitPreference,
    goBack,
  } = useCarDetailsPage();

  // Tracker state shared across pages
  const { trackerMode, toggleTrackerMode } = useTrackerMode();

  // A) Default 1★ for key cars in tracker mode (no overwrite)
  useKeyCarSeeding(car, trackerMode);

  // B) Persist “Key obtained” (+ mark owned when true)
  const handleKeyObtainedChange = useKeyObtainedHandler(car, setKeyObtained);

  // C) Debounced autosync
  useAutoSyncDependency([keyObtained, trackerMode, car?.Brand, car?.Model]);

  if (error) {
    return (
      <div className="carDetail">
        <h2 className="error-message">⚠️ Could not load this car's details.</h2>
        <p>The car may not exist or an error occurred while fetching.</p>
        <button onClick={goBack} className="backBtn">Back to Car List</button>
      </div>
    );
  }

  if (!car) return <div className="loading-message">Loading car details...</div>;

  const title = `${car.Brand} ${car.Model}`;

  return (
    <div className="carDetail">
      <PageTab title={title}>
        <Header text={title} />

        {/* No title duplication here */}
        <DetailHeader onBack={goBack} updatedAt={car.updatedAt} status={status} />

        <div className="toolsRow">
          <CarTrackerToggle isEnabled={trackerMode} onToggle={toggleTrackerMode} />
        </div>

        <CarImage car={car} />

        <TablesGrid
          car={car}
          trackerMode={trackerMode}
          keyObtained={keyObtained}
          onKeyObtainedChange={handleKeyObtainedChange}
          unitPreference={unitPreference}
        />

        <hr className="content-divider" />
        <CommentsPanel normalizedKey={slug!} brand={car.Brand} model={car.Model} />
      </PageTab>
    </div>
  );
}