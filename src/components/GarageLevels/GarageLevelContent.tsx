import { Car } from "@/components/GarageLevels/interface";
import BackToTop from "@/components/Shared/BackToTopButton";

interface GarageLevelProps {
  GarageLevelKey: number;
  xp: number;
  cars: Car[];
}

// ✅ Keep accent marks (for folder names like "Citroën")
const sanitizeBrandName = (brand: string): string =>
  brand.replace(/\s+/g, "").replace(/[^a-zA-Z0-9À-ÿœŒ]/g, "");

export function GLContent({ GarageLevelKey, xp, cars }: GarageLevelProps) {
  if (!GarageLevelKey) {
    return <p className="error">⚠️ Missing Garage Level Key.</p>;
  }

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
          cars.map((car, index) => {
            const { brand, model, image } = car;

            if (!brand || !model || !image) {
              console.warn(`⚠️ Incomplete car data at index ${index}:`, car);
              return (
                <div key={`incomplete-${index}`} className="warning">
                  ⚠️ Missing data for car at index {index}.
                </div>
              );
            }

            const sanitizedBrand = sanitizeBrandName(brand); // preserves accents
            const filename = image.split("/").pop(); // assume filename is clean
            const imagePath = `${import.meta.env.VITE_API_BASE_URL}/images/cars/${sanitizedBrand[0]}/${sanitizedBrand}/${filename}`;

            console.log(`[${index}] Brand: ${brand}`);
            console.log(`[${index}] Sanitized: ${sanitizedBrand}`);
            console.log(`[${index}] Final image path: ${imagePath}`);

            return (
              <div key={`${model}-${index}`}>
                <img
                  className="CarImages"
                  src={imagePath}
                  alt={`${brand} ${model}`}
                />
                <p className="CarImagesCaption">{`${brand} ${model}`}</p>
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
