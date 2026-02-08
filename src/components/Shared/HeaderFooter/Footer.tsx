import { NavLink } from "react-router-dom";

const YEAR = new Date().getFullYear();

export default function Footer() {
  return (
    <footer className="Footer" role="contentinfo">
      <div className="Footer__links" aria-label="Footer links">
        <a
          href="https://asphaltlegendsunite.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="Footer__link Footer__link--external"
          aria-label="Open the official Asphalt Legends website (opens in a new tab)"
        >
          Official Website
        </a>

        <span className="Footer__dot" aria-hidden="true">•</span>

        <NavLink
          to="/feedback"
          className={({ isActive }) =>
            `Footer__link ${isActive ? "Footer__link--active" : ""}`
          }
        >
          Feedback
        </NavLink>

        <span className="Footer__dot" aria-hidden="true">•</span>

        <NavLink
          to="/about"
          className={({ isActive }) =>
            `Footer__link ${isActive ? "Footer__link--active" : ""}`
          }
        >
          About
        </NavLink>

        <span className="Footer__dot" aria-hidden="true">•</span>

        <NavLink
          to="/sources"
          className={({ isActive }) =>
            `Footer__link ${isActive ? "Footer__link--active" : ""}`
          }
        >
          Sources
        </NavLink>
      </div>

      <div className="Footer__meta" aria-label="Site notice">
        <span className="Footer__fineprint Footer__fineprint--nowrap">© {YEAR} Asphalt Legends Tracker</span>
        <span className="Footer__sep" aria-hidden="true">·</span>
        <span className="Footer__fineprint">Unofficial fan project</span>
        <span className="Footer__sep" aria-hidden="true">·</span>
        <span className="Footer__fineprint">Not affiliated with Gameloft</span>
      </div>
    </footer>
  );
}