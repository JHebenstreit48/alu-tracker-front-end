import { useEffect, useState } from 'react';
import '@/scss/MiscellaneousStyle/BackToTop.scss';

const BackToTop: React.FC = () => {
  const [atBottom, setAtBottom] = useState(false);

  const scrollToTop = () => {
    // Force instant even if a global "smooth" is set in CSS
    const root = (document.scrollingElement || document.documentElement) as HTMLElement;
    const prev = root.style.scrollBehavior;
    root.style.scrollBehavior = 'auto';
    window.scrollTo({ top: 0, left: 0 }); // instant
    root.style.scrollBehavior = prev;
  };

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const doc = document.documentElement;
        const body = document.body;
        const scrollY = window.scrollY || doc.scrollTop;
        const viewport = window.innerHeight || doc.clientHeight;
        const docHeight = Math.max(
          body.scrollHeight, doc.scrollHeight,
          body.offsetHeight, doc.offsetHeight,
          body.clientHeight, doc.clientHeight
        );
        const BUFFER = 6; // px; lift the button when we're within this of the bottom
        setAtBottom(scrollY + viewport >= docHeight - BUFFER);
        ticking = false;
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    onScroll(); // initialize
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <div className={`BackToTop ${atBottom ? 'at-bottom' : ''}`}>
      <a onClick={scrollToTop} className="back-to-top-button">
        Back to Top
      </a>
    </div>
  );
};

export default BackToTop;