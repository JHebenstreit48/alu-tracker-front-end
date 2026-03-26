import { useState } from "react";
import { getCarImageUrl } from "@/utils/shared/imageUrl";
import type { Car } from "@/types/GarageLevels/garageLevelCars";

interface GarageLevelProps {
  GarageLevelKey: number;
  xp: number;
  cars: Car[];
}

interface GLCarImageProps {
  car: Car;
  index: number;
}

function GLCarImage({ car, index }: GLCarImageProps) {
  const [errored, setErrored] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const src = getCarImageUrl(car.image);

  return (
    <div key={`${car.brand}-${car.model}-${index}`}>
      {!errored && (
        <img
          className="CarImages"
          src={src}
          alt={`${car.brand} ${car.model}`}
          style={{ display: loaded ? "block" : "none" }}
          onLoad={() => setLoaded(true)}
          onError={() => setErrored(true)}
        />
      )}

      {(!loaded || errored) && (
        <div className="CarImages" />
      )}

      <p className="CarImagesCaption">
        {car.brand} {car.model}
      </p>
    </div>
  );
}

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
            <GLCarImage
              key={`${car.brand}-${car.model}-${i}`}
              car={car}
              index={i}
            />
          ))
        ) : (
          <p>No cars available.</p>
        )}
      </div>
    </section>
  );
}