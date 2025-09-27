// src/components/Shared/Footer.tsx
import { NavLink } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="Footer">
      <a
        href="https://asphaltlegendsunite.com/"
        target="_blank"
        rel="noopener noreferrer"
        className="Footer__link Footer__link--external"
      >
        Asphalt Legends Unite Website
      </a>
      <span className="Footer__dot">•</span>
      <NavLink
        to="/feedback"
        className={({ isActive }) =>
          `Footer__link ${isActive ? "Footer__link--active" : ""}`
        }
      >
        Feedback
      </NavLink>
    </footer>
  );
}