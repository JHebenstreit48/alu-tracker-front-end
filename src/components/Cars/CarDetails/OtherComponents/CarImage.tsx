import { Car } from "@/components/Cars/CarDetails/Miscellaneous/Interfaces";

// Prefer the static Image Vault for car photos
const IMG_CDN_BASE =
  import.meta.env.VITE_IMG_CDN_BASE ?? "https://alu-tracker-image-vault.onrender.com";

// If backend already returns an absolute URL, pass it through.
// Otherwise, prefix the CDN base.
const absolutize = (p?: string): string | undefined => {
  if (!p) return undefined;
  return /^https?:\/\//i.test(p) ? p : `${IMG_CDN_BASE}${p.startsWith("/") ? "" : "/"}${p}`;
};

// Optional: a nice fallback image you host in the Image Vault
const FALLBACK = `${IMG_CDN_BASE}/images/fallbacks/car-missing.jpg`;

interface CarImageProps {
  car: Car;
}

const CarImage: React.FC<CarImageProps> = ({ car }) => {
  const src = absolutize(car.Image) ?? FALLBACK;
  const alt = `${car.Brand} ${car.Model}`;

  return (
    <div className="carImageContainer">
      <img
        src={src}
        alt={alt}
        className="carImage"
        onError={(e) => {
          const img = e.currentTarget as HTMLImageElement;
          if (img.src !== FALLBACK) img.src = FALLBACK; // swap once if missing
        }}
      />
    </div>
  );
};

export default CarImage;