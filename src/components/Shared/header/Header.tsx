import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Navigation from '@/components/Shared/Navigation/Navigation';
import AuthButtons from '@/components/SignupLogin/UI/AuthButtons';

interface HeaderProps {
  className?: string;
  siteName?: string;
  mobileSiteName?: string;
}

export default function Header({
  className,
  siteName,
  mobileSiteName,
}: HeaderProps) {
  const headerRef = useRef<HTMLElement | null>(null);

  /* ---------- Mobile detection ---------- */

  const [isMobile, setIsMobile] = useState(false);
  const [isNavOpen, setIsNavOpen] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(max-width: 768px)');
    const update = () => setIsMobile(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  /* ---------- Site Name ---------- */

  const resolvedSiteName =
    siteName ??
    (isMobile ? mobileSiteName ?? 'AL Tracker' : 'Asphalt Legends Tracker');

  return (
    <header
      className={`Header ${className || ''}`}
      role="banner"
      ref={headerRef}
    >
      <div className="Header__inner">

        {/* LEFT */}
        <div className="Header__site">
          <Link to="/" className="SiteTitle" aria-label="Go to home page">
            <img
              src="/favicon/ALTracker.webp"
              alt="Asphalt Legends Tracker logo"
              className="SiteLogo"
            />
            <span className="SiteName">{resolvedSiteName}</span>
          </Link>
        </div>

        {/* HAMBURGER */}
        <button
          className="Hamburger"
          aria-label="Toggle navigation"
          aria-expanded={isNavOpen}
          aria-controls="main-nav"
          onClick={() => setIsNavOpen((o) => !o)}
          type="button"
        >
          ☰
        </button>

        {/* CENTER */}
        <div className="Header__nav">
          <Navigation isOpen={isNavOpen} />
        </div>

        {/* RIGHT */}
        <div className="Header__auth">
          <AuthButtons />
        </div>

      </div>
    </header>
  );
}