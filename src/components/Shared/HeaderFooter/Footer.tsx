import { NavLink } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="Footer" role="contentinfo">
      <div className="Footer__links" aria-label="Footer links">
        <a
          href="https://asphaltlegendsunite.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="Footer__link Footer__link--external"
          aria-label="Open the official Asphalt Legends Unite website (opens in a new tab)"
        >
          Official Website
        </a>

        <span className="Footer__dot" aria-hidden="true">
          •
        </span>

        <NavLink
          to="/feedback"
          className={({ isActive }) =>
            `Footer__link ${isActive ? "Footer__link--active" : ""}`
          }
        >
          Feedback
        </NavLink>

        <span className="Footer__dot" aria-hidden="true">
          •
        </span>

        <NavLink
          to="/about"
          className={({ isActive }) =>
            `Footer__link ${isActive ? "Footer__link--active" : ""}`
          }
        >
          About
        </NavLink>
      </div>

      <div className="Footer__meta">
        <span className="Footer__fineprint">© {new Date().getFullYear()} Asphalt Legends Tracker</span>
        <span className="Footer__sep" aria-hidden="true">·</span>
        <span className="Footer__fineprint">Fan-made • Not affiliated with Gameloft</span>
      </div>
    </footer>
  );
}