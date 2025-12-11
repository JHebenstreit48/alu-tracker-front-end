import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';

interface INavigationButtons {
  label: string;
  onClick: () => void;
  isActive: boolean;
}

const NavigationButtons = ({ label, onClick, isActive }: INavigationButtons) => {
  return (
    <button
      onClick={onClick}
      type="button"
      className={`btn btn-primary btn-lg ${isActive ? 'is-active' : ''}`}
      aria-current={isActive ? 'page' : undefined}
    >
      {label}
    </button>
  );
};

export default function Navigation() {
  const navigate = useNavigate();
  const currentPath = useLocation().pathname;
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    // Home removed – site name handles it now
    {
      label: 'Brands',
      location: '/brands',
      go: () => navigate('/brands'),
    },
    {
      label: 'Cars',
      location: '/cars',
      go: () => navigate('/cars'),
    },
    {
      label: 'Garage Levels',
      location: '/garagelevels',
      go: () => navigate('/garagelevels'),
    },
    {
      label: 'Legend Store',
      location: '/legendstoreprices',
      go: () => navigate('/legendstoreprices'),
    },
  ];

  // Active on exact root or any sub-route (e.g., /cars/slug keeps Cars active)
  const isActive = (loc: string) =>
    loc === '/' ? currentPath === '/' : currentPath === loc || currentPath.startsWith(loc + '/');

  return (
    <>
      <button
        className="Hamburger"
        aria-label="Toggle navigation"
        aria-expanded={isOpen}
        aria-controls="main-nav"
        onClick={() => setIsOpen((o) => !o)}
        type="button"
      >
        ☰
      </button>

      <nav
        className={`NavigationWrapper ${isOpen ? 'open' : ''}`}
        aria-label="Primary"
      >
        <ul
          id="main-nav"
          className="nav-css"
          role="menubar"
        >
          {links.map((link) => (
            <li
              key={link.label}
              role="none"
            >
              <NavigationButtons
                label={link.label}
                onClick={link.go}
                isActive={isActive(link.location)}
              />
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
