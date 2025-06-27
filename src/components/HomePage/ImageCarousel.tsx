import { useEffect, useState } from 'react';
import { ImageCarouselType } from '@/components/HomePage/ImagesForCarousel';
import LoadingSpinner from '@/components/Shared/LoadingSpinner';

const backendImageUrl =
  import.meta.env.VITE_API_BASE_URL ?? 'https://alutracker-api.onrender.com';

type ImageCarouselPropsType = {
  project: ImageCarouselType[];
};

// Set to true if you're testing (e.g., <img> commented out)
const FORCE_SPINNER_MODE = false;
const SIMULATED_DELAY = 5000;

export default function ImageCarousel({ project }: ImageCarouselPropsType) {
  const [imagesLoaded, setImagesLoaded] = useState(0);
  const [hasLoadedAll, setHasLoadedAll] = useState(false);

  const handleImageLoad = () => setImagesLoaded((prev) => prev + 1);
  const handleImageError = () => setImagesLoaded((prev) => prev + 1);

  // ✅ Mark as done when images fully load
  useEffect(() => {
    if (!FORCE_SPINNER_MODE && imagesLoaded >= project.length && project.length > 0) {
      setHasLoadedAll(true);
    }
  }, [imagesLoaded, project.length]);

  // ✅ Only for test mode: simulate load delay
  useEffect(() => {
    if (FORCE_SPINNER_MODE) {
      const timeout = setTimeout(() => {
        setHasLoadedAll(true);
      }, SIMULATED_DELAY);
      return () => clearTimeout(timeout);
    }
  }, []);

  return (
    <div
      id="asphalt-carousel-slides"
      className="carousel slide"
      data-bs-ride="carousel"
      data-bs-interval="2000"
      data-bs-pause="false"
    >
      <div className="carousel-inner">
        {project.map((image, index) => (
          <div
            className={`carousel-item ${index === 0 ? 'active' : ''}`}
            key={index}
          >
            <div
              className="carousel-image-box"
              style={{
                position: 'relative',
                minHeight: '39rem',
              }}
            >
              {/* ✅ Toggle this line during testing */}
              {!FORCE_SPINNER_MODE && (
                <img
                  src={`${backendImageUrl}${image.path}`}
                  alt={`Car Image ${index + 1}`}
                  className="d-block w-100"
                  loading="lazy"
                  onLoad={handleImageLoad}
                  onError={handleImageError}
                  style={{
                    opacity: hasLoadedAll ? 1 : 0.2,
                    transition: 'opacity 0.3s ease-in-out',
                  }}
                />
              )}

              {/* 🔄 Spinner and background overlay */}
              {!hasLoadedAll && (
                <>
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      backgroundColor: '#1f1f1f',
                      zIndex: 1,
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      zIndex: 2,
                      textAlign: 'center',
                    }}
                  >
                    <LoadingSpinner message="Cars entering the starting line!" />
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
