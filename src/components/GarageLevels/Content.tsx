import type { Car } from "@/interfaces/GarageLevels";

interface GarageLevelProps {
  GarageLevelKey: number;
  xp: number;
  cars: Car[];
}

const FALLBACK = "/images/fallbacks/car-missing.jpg"; // adjust if you have a different path

export function GLContent({ GarageLevelKey, xp, cars }: GarageLevelProps) {
  if (!GarageLevelKey) {
    return <p className="error">⚠️ Missing Garage Level Key.</p>;
  }

  return (
    <section id={`garage-level-${GarageLevelKey}`}>
      <div>
        <h2 className="mainHeading">Garage Level {GarageLevelKey}</h2>
        <h3 className="subHeading">Cars Available</h3>
      </div>

      <div className="xp">
        <h3 className="xpTitle">
          XP Required{" "}
          <span className="xpRequirement">
            {xp.toLocaleString("en-US")}
          </span>
        </h3>
      </div>

      <div className="CarImagesContainer">
        {cars.length > 0 ? (
          cars.map((car, i) => (
            <div key={`${car.brand}-${car.model}-${i}`}>
              <img
                className="CarImages"
                src={car.image || FALLBACK}
                alt={`${car.brand} ${car.model}`}
                onError={(e) => {
                  const img = e.currentTarget as HTMLImageElement;
                  if (img.src !== FALLBACK) img.src = FALLBACK;
                }}
              />
              <p className="CarImagesCaption">
                {car.brand} {car.model}
              </p>
            </div>
          ))
        ) : (
          <p>No cars available.</p>
        )}
      </div>
    </section>
  );
}