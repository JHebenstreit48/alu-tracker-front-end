import { memo } from "react";

type SlideProps = {
  src: string;
  alt: string;
  isActive: boolean;
  onLoad: () => void;
  onError: () => void;
  eager?: boolean;
};

function SlideBase({
  src,
  alt,
  isActive,
  onLoad,
  onError,
  eager = false,
}: SlideProps) {
  return (
    <div
      className={`carousel-item ${isActive ? "active" : ""}`}
      aria-hidden={!isActive}
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
      </div>
    </div>
  );
}

export const Slide = memo(SlideBase);