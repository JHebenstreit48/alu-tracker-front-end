import { useState } from "react";
import type { Car } from "@/types/shared/car";
import { getCarImageUrl } from "@/utils/shared/imageUrl";

interface CarImageProps {
  car: Car;
}

const CarImage: React.FC<CarImageProps> = ({ car }) => {
  const [errored, setErrored] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const src = getCarImageUrl(car.image);
  const alt = `${car.brand} ${car.model}`;

  return (
    <div className={`carImageContainer ${car.keyCar ? "isKeyCar" : "isNonKeyCar"}`}>
      {!errored && (
        <img
          src={src}
          alt={alt}
          className="carImage"
          style={{ display: loaded ? "flex" : "none" }}
          onLoad={() => setLoaded(true)}
          onError={() => setErrored(true)}
        />
      )}

      {(!loaded || errored) && (
        <div className="carImagePlaceholder">
          {errored && (
            <span className="carImagePlaceholderText">
              Image not yet available
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default CarImage;