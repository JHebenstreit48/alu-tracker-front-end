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

  // single source of truth for tracker mode across pages
  const { trackerMode, toggleTrackerMode } = useTrackerMode();

  if (error) {
    return (
      <div className="carDetail">
        <h2 className="error-message">⚠️ Could not load this car's details.</h2>
        <p>The car may not exist or an error occurred while fetching.</p>
        <button onClick={goBack} className="backBtn">
          Back to Car List
        </button>
      </div>
    );
  }

  if (!car) return <div className="loading-message">Loading car details...</div>;

  const title = `${car.Brand} ${car.Model}`;

  return (
    <div className="carDetail">
      <PageTab title={title}>
        <Header text={title} />

        {/* no title here anymore to avoid duplication */}
        <DetailHeader onBack={goBack} updatedAt={car.updatedAt} status={status} />

        {/* Tools row: tracker toggle lives here */}
        <div className="toolsRow">
          <CarTrackerToggle isEnabled={trackerMode} onToggle={toggleTrackerMode} />
        </div>

        <CarImage car={car} />

        <TablesGrid
          car={car}
          trackerMode={trackerMode}
          keyObtained={keyObtained}
          onKeyObtainedChange={setKeyObtained}
          unitPreference={unitPreference}
        />

        <hr className="content-divider" />

        <CommentsPanel normalizedKey={slug!} brand={car.Brand} model={car.Model} />
      </PageTab>
    </div>
  );
}