// components/GarageLevels/Content.tsx
import { Car } from "@/components/GarageLevels/interface";
import BackToTop from "@/components/Shared/BackToTopButton";

const IMG_CDN_BASE =
  import.meta.env.VITE_IMG_CDN_BASE ?? "https://alu-tracker-image-vault.onrender.com";

// Match backend sanitizer: drop spaces/'/-, map & -> and, keep Unicode letters
const sanitizeBrand = (s: string): string =>
  s
    .replace(/[\s'-]/g, '')
    .replace(/&/g, 'and')
    .normalize('NFC')
    .replace(/[^\p{L}0-9_-]/gu, '');

const buildCarImagePath = (brand: string, file: string): string => {
  const letter = brand?.[0]?.toUpperCase() ?? '_';
  const folder = sanitizeBrand(brand);
  const filename = (file || '').split('/').pop() || '';
  return `/images/cars/${letter}/${folder}/${filename}`;
};

const FALLBACK = `${IMG_CDN_BASE}/images/fallbacks/car-missing.jpg`;

interface GarageLevelProps {
  GarageLevelKey: number;
  xp: number;
  cars: Car[];
}

export function GLContent({ GarageLevelKey, xp, cars }: GarageLevelProps) {
  if (!GarageLevelKey) return <p className="error">⚠️ Missing Garage Level Key.</p>;

  return (
    <section id={`garage-level-section-${GarageLevelKey}`}>
      <div>
        <h2 className="mainHeading">{`Garage Level ${GarageLevelKey}`}</h2>
        <h3 className="subHeading">Cars Available</h3>
      </div>

      <div className="xp">
        <h3 className="xpTitle">
          XP Required <span className="xpRequirement">{xp.toLocaleString("en-US")}</span>
        </h3>
      </div>

      <div className="CarImagesContainer">
        {cars.length > 0 ? (
          cars.map((car, i) => {
            const rel = buildCarImagePath(car.brand, car.image);
            const src = `${IMG_CDN_BASE}${rel}`;
            return (
              <div key={`${car.model}-${i}`}>
                <img
                  className="CarImages"
                  src={src}
                  alt={`${car.brand} ${car.model}`}
                  onError={(e) => {
                    const img = e.currentTarget as HTMLImageElement;
                    if (img.src !== FALLBACK) img.src = FALLBACK;
                  }}
                />
                <p className="CarImagesCaption">{`${car.brand} ${car.model}`}</p>
              </div>
            );
          })
        ) : (
          <p>No cars available.</p>
        )}
      </div>

      <BackToTop />
    </section>
  );
}