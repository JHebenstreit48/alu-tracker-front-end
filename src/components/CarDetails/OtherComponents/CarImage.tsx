import type { Car } from "@/types/shared/car"; // or wherever Car lives now

const FALLBACK = "/images/fallbacks/car-missing.jpg"; // optional, served by your app

interface CarImageProps {
  car: Car;
}

const CarImage: React.FC<CarImageProps> = ({ car }) => {
  const src = car.image || FALLBACK;
  const alt = `${car.brand} ${car.model}`;

  return (
    <div className="carImageContainer">
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