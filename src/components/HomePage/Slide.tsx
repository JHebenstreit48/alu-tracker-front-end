import { memo } from 'react';

type SlideProps = {
  src: string;
  alt: string;
  isActive: boolean;
  eager?: boolean;
};

function SlideBase({ src, alt, isActive, eager = false }: SlideProps) {
  return (
    <div
      className={`carousel-item ${isActive ? 'active' : ''}`}
      aria-hidden={!isActive}
    >
      <div className="carousel-image-box">
        <img
          src={src}
          alt={alt}
          className="d-block w-100"
          loading={eager ? 'eager' : 'lazy'}
          fetchPriority={eager ? 'high' : 'auto'}
        />
        <div className="carousel-caption">
          <p>{alt}</p>
        </div>
      </div>
    </div>
  );
}

export const Slide = memo(SlideBase);