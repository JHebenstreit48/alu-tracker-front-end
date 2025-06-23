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
            <div className="carousel-image-box">
              {!hasLoadedAll ? (
                <LoadingSpinner />
              ) : (
                <img
                  src={`${backendImageUrl}${image.path}`}
                  alt={`Car Image ${index + 1}`}
                  className="d-block w-100"
                  loading="lazy"
                  onLoad={handleImageLoad}
                  onError={handleImageError}
                />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
