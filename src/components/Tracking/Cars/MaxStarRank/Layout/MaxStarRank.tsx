import MaxStarTables from "@/components/Tracking/Cars/MaxStarRank/UI/MaxStarTables";
import { Car } from "@/types/shared/car";
import { CarTracking } from "@/types/shared/tracking";

interface Props {
  allCars: Car[];
  trackedCars: (Car & CarTracking)[];
  totalCars: number;
}

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

function isMaxStars(car: Car, t?: any): boolean {
  if (!t) return false;

  const trackedStars = getTrackedStars(t);
  if (typeof trackedStars === "number") return trackedStars >= car.stars;

  // fallback ONLY if you truly store a boolean for “max stars reached”
  return Boolean(t.maxed ?? t.isMaxed);
}

export default function MaxStarRank({ allCars, trackedCars, totalCars }: Props) {
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
    <div className="maxStarSection">
      <h3 className="maxStarGridTitle">Star Tier Progress</h3>

      <div className="maxStarGridWrapper">
        <div className="maxStarGrid">
          {[3, 4, 5, 6].map((rank) => {
            const carsOfRank = allCars.filter((c) => c.stars === rank);
            const totalInGame = carsOfRank.length;

            const ownedCars = carsOfRank.filter((c) => isOwned(getTracking(c)));
            const owned = ownedCars.length;

            const maxed = ownedCars.filter((c) => isMaxStars(c, getTracking(c))).length;
            const inProgress = Math.max(0, owned - maxed);

            return (
              <MaxStarTables
                key={rank}
                rank={rank as 3 | 4 | 5 | 6}
                owned={owned}
                inProgress={inProgress}
                maxed={maxed}
                totalInGame={totalInGame}
                percentMaxed={owned > 0 ? (maxed / owned) * 100 : 0}
              />
            );
          })}

          <p className="totalCarNotice">Total Cars in Game: {totalCars}</p>
        </div>
      </div>
    </div>
  );
}