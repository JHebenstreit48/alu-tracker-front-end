import { memo } from "react";
import LoadingSpinner from "@/components/Shared/LoadingSpinner";

type SlideProps = {
  src: string;
  alt: string;
  isActive: boolean;
  showOverlay: boolean;
  onLoad: () => void;
  onError: () => void;
  eager?: boolean;
};

function SlideBase({
  src,
  alt,
  isActive,
  showOverlay,
  onLoad,
  onError,
  eager = false,
}: SlideProps) {
  return (
    <div
      className={`carousel-item ${isActive ? "active" : ""}`}
      style={{ display: isActive ? "block" : "none" }} // hide inactive
    >
      <div className="carousel-image-box">
        <img
          src={src}
          alt={alt}
          className="d-block w-100"
          loading={eager ? "eager" : "lazy"}
          onLoad={onLoad}
          onError={onError}
        />
        {showOverlay && (
          <>
            <div className="carousel-overlay" />
            <div className="carousel-spinner">
              <LoadingSpinner message="Cars entering the starting line!" />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export const Slide = memo(SlideBase);