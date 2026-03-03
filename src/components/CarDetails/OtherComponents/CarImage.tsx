import type { Car } from "@/types/shared/car";

const FALLBACK = "/images/fallbacks/car-missing.jpg";

interface CarImageProps {
  car: Car;
}

const CarImage: React.FC<CarImageProps> = ({ car }) => {
  const src = car.image || FALLBACK;
  const alt = `${car.brand} ${car.model}`;

  return (
    <div className={`carImageContainer ${car.keyCar ? "isKeyCar" : "isNonKeyCar"}`}>
      <img
        src={src}
        alt={alt}
        className="carImage"
        onError={(e) => {
          const img = e.currentTarget as HTMLImageElement;
          if (img.src !== FALLBACK) {
            img.src = FALLBACK;
          }
        }}
      />
    </div>
  );
};

export default CarImage;