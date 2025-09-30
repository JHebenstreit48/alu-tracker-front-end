// src/pages/MainPages/CarInfo/CarDetails.tsx
import { useParams } from "react-router-dom";

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

import "@/scss/Cars/CarDetail.scss";
import "@/scss/Cars/CarStatus.scss";

export default function CarDetails() {
  // route param -> pass into the page hook
  const { slug } = useParams<{ slug: string }>();
  const {
    car,
    status,
    error,
    keyObtained,
    setKeyObtained,
    unitPreference,
    goBack,
  } = useCarDetailsPage(slug);

  // shared tracker state
  const { trackerMode, toggleTrackerMode } = useTrackerMode();

  // seed 1★ for key cars (doesn't overwrite existing)
  useKeyCarSeeding(car, trackerMode);

  // persist KeyObtained (+ mark owned when true)
  const handleKeyObtainedChange = useKeyObtained(car, setKeyObtained);

  // debounced autosync on meaningful changes
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