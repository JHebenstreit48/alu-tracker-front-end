import { useEffect } from 'react';

interface CarNavArrowsProps {
  prevSlug: string | null;
  nextSlug: string | null;
  onNavigate: (slug: string) => void;
}

export default function CarNavArrows({ prevSlug, nextSlug, onNavigate }: CarNavArrowsProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' && prevSlug) onNavigate(prevSlug);
      if (e.key === 'ArrowRight' && nextSlug) onNavigate(nextSlug);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [prevSlug, nextSlug, onNavigate]);

  if (!prevSlug && !nextSlug) return null;

  return (
    <>
      {prevSlug && (
        <button
          className="carNavArrow carNavArrow--prev"
          onClick={() => onNavigate(prevSlug)}
          aria-label="Previous car"
        >
          &#8592;
        </button>
      )}
      {nextSlug && (
        <button
          className="carNavArrow carNavArrow--next"
          onClick={() => onNavigate(nextSlug)}
          aria-label="Next car"
        >
          &#8594;
        </button>
      )}
    </>
  );
}