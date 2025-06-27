import { useEffect, useState } from "react";
import { ImageCarouselType } from "@/components/HomePage/ImagesForCarousel";
import LoadingSpinner from "@/components/Shared/LoadingSpinner";

const backendImageUrl = import.meta.env.VITE_API_BASE_URL ?? "https://alutracker-api.onrender.com";

type ImageCarouselPropsType = {
  project: ImageCarouselType[];
};

export default function ImageCarousel({ project }: ImageCarouselPropsType) {
  const [imagesLoaded, setImagesLoaded] = useState(0);
  const [hasLoadedAll, setHasLoadedAll] = useState(false);

  useEffect(() => {
    if (imagesLoaded >= project.length) {
      setHasLoadedAll(true);
    }
  }, [imagesLoaded, project.length]);

  const handleImageLoad = () => setImagesLoaded((prev) => prev + 1);
  const handleImageError = () => setImagesLoaded((prev) => prev + 1);

  return (
    <div id="asphalt-carousel-slides" className="carousel slide" data-bs-ride="carousel">
      <div className="carousel-inner">
        {project.map((image, index) => (
          <div
            className={`carousel-item ${index === 0 ? "active" : ""}`}
            key={index}
          >
            <div className="carousel-image-box" style={{ position: "relative" }}>
              <img
                src={`${backendImageUrl}${image.path}`}
                alt={`Car Image ${index + 1}`}
                className="d-block w-100"
                loading="lazy"
                onLoad={handleImageLoad}
                onError={handleImageError}
                style={{ opacity: hasLoadedAll ? 1 : 0.2, transition: "opacity 0.3s ease-in-out" }}
              />
              {!hasLoadedAll && (
                <div style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  zIndex: 2
                }}>
                  <LoadingSpinner />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

