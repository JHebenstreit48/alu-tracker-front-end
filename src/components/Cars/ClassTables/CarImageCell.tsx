import StarRank from "@/components/Shared/Stars/StarRank";
import type { Car } from "@/types/shared/car";
import type { CarTracking } from "@/types/shared/tracking";

interface CarImageCellProps {
  car: Car;
  carKey: string;
  trackingEnabled: boolean;
  tracking?: CarTracking;
}

function isOwned(entry?: CarTracking): boolean {
  if (!entry) return false;

  return (
    Boolean(entry.owned) ||
    Boolean(entry.isOwned) ||
    Boolean(entry.hasCar) ||
    Boolean(entry.hasOwned)
  );
}

export function CarImageCell({
  car,
  carKey,
  trackingEnabled,
  tracking,
}: CarImageCellProps) {
  const imageSrc = car.image ?? null;
  const altText = `${car.brand} ${car.model}`;

  if (car.ImageStatus === "Removed") {
    return <span className="noImage">🚫 Removed from Game</span>;
  }

  if (car.ImageStatus === "Coming Soon") {
    return <span className="noImage">🚧 Image Coming Soon</span>;
  }

  if (!imageSrc) {
    return <span className="noImage">❓ Unknown</span>;
  }

  const owned = trackingEnabled && isOwned(tracking);
  const imgClass = `carPic${trackingEnabled && !owned ? " carPic--locked" : ""}`;

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
          count={car.stars}
          trackerMode={trackingEnabled}
          trackingKey={carKey}
          isKeyCar={car.keyCar}
        />
      </div>
    </>
  );
}