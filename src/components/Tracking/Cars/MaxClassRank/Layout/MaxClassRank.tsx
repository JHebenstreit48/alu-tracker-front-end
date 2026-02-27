import MaxClassTables from "@/components/Tracking/Cars/MaxClassRank/UI/MaxClassTables";
import { Car } from "@/types/shared/car";
import { CarTracking } from "@/types/shared/tracking";

interface Props {
  allCars: Car[];
  trackedCars: (Car & CarTracking)[];
}

const CLASSES = ["D", "C", "B", "A", "S"] as const;
type CarClass = (typeof CLASSES)[number];

function isOwned(t?: any): boolean {
  if (!t) return false;
  return Boolean(t.owned ?? t.isOwned ?? t.hasCar ?? t.hasOwned);
}

function getTrackedStars(t?: any): number | undefined {
  if (!t) return undefined;
  const v =
    (typeof t.stars === "number" ? t.stars : undefined) ??
    (typeof t.currentStars === "number" ? t.currentStars : undefined) ??
    (typeof t.starCount === "number" ? t.starCount : undefined);
  return typeof v === "number" ? v : undefined;
}

/**
 * "Maxed" here means: reached the car's max star count (not gold max).
 * car.stars = max stars for that car
 * tracking.stars = current stars owned by user (ideally)
 */
function isMaxStars(car: Car, t?: any): boolean {
  if (!t) return false;

  const trackedStars = getTrackedStars(t);
  if (typeof trackedStars === "number") return trackedStars >= car.stars;

  // fallback only if you store a boolean for “max stars reached”
  return Boolean(t.maxed ?? t.isMaxed);
}

export default function MaxClassRank({ allCars, trackedCars }: Props) {
  // Build lookup by normalizedKey (stable) + fallback by id
  const trackingByKey = new Map<string, CarTracking>();
  const trackingById = new Map<number, CarTracking>();

  for (const t of trackedCars) {
    if (typeof t.normalizedKey === "string" && t.normalizedKey.length > 0) {
      trackingByKey.set(t.normalizedKey, t);
    }
    if (typeof t.id === "number") {
      trackingById.set(t.id, t);
    }
  }

  const getTracking = (car: Car): CarTracking | undefined => {
    if (car.normalizedKey && trackingByKey.has(car.normalizedKey)) {
      return trackingByKey.get(car.normalizedKey);
    }
    return trackingById.get(car.id);
  };

  return (
    <div className="maxClassSection">
      <h3 className="maxClassGridTitle">Class Tier Progress</h3>

      <div className="maxClassGridWrapper">
        <div className="maxClassGrid">
          {CLASSES.map((carClass) => {
            // Universe should be ALL cars in game of this class
            const carsOfClass = allCars.filter((car) => car.class === carClass);
            const totalInGame = carsOfClass.length;

            // Owned based on tracking, not whether trackedCars contains it
            const ownedCars = carsOfClass.filter((car) => isOwned(getTracking(car)));
            const owned = ownedCars.length;

            const maxed = ownedCars.filter((car) => isMaxStars(car, getTracking(car))).length;
            const inProgress = Math.max(0, owned - maxed);

            return (
              <MaxClassTables
                key={carClass}
                carClass={carClass as CarClass}
                owned={owned}
                inProgress={inProgress}
                maxed={maxed}
                totalInGame={totalInGame}
                percentMaxed={owned > 0 ? (maxed / owned) * 100 : 0}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}