import StarRank from "@/components/Shared/Stars/StarRank";
import { useCarListTracking } from "@/hooks/Cars/useCarListTracking";
import type { Car } from "@/types/shared/car";

interface CarImageCellProps {
  car: Car;
  carKey: string;
}

export function CarImageCell({ car, carKey }: CarImageCellProps) {
  const { trackingEnabled, getTrackingForKey } = useCarListTracking();
  const tracking = getTrackingForKey(carKey);
  const isOwned = trackingEnabled && !!tracking?.owned;

  const imageSrc = car.Image ?? null;
  const altText = `${car.Brand} ${car.Model}`;

  if (car.ImageStatus === "Removed") {
    return <span className="noImage">🚫 Removed from Game</span>;
  }
  if (car.ImageStatus === "Coming Soon") {
    return <span className="noImage">🚧 Image Coming Soon</span>;
  }
  if (!imageSrc) {
    return <span className="noImage">❓ Unknown</span>;
  }

  const imgClass = `carPic${trackingEnabled && !isOwned ? " carPic--locked" : ""}`;

  return (
    <>
      <img
        className={imgClass}
        src={imageSrc}
        alt={altText}
        onError={(e) => {
          const img = e.currentTarget as HTMLImageElement;
          img.style.display = "none";
          if (img.parentElement) {
            img.parentElement.innerHTML =
              '<span class="noImage">❌ File Not Found</span>';
          }
        }}
      />
      <div className="starOverlay">
        <StarRank
          count={car.Stars}
          trackerMode={trackingEnabled}
          trackingKey={carKey}
          isKeyCar={car.KeyCar}
        />
      </div>
    </>
  );
}