import { NavLink } from "react-router-dom";
import { FOOTER_LINKS, getFooterLinkClass } from "@/utils/shared/footerLinks";

export default function FooterLinks() {
  return (
    <nav aria-label="Footer">
      <ul className="Footer__links">
        {FOOTER_LINKS.map((link) => (
          <li key={link.label}>
            {link.external ? (
              <a
                href={link.to}
                target="_blank"
                rel="noopener noreferrer"
                className="Footer__link"
                aria-label={link.ariaLabel}
              >
                {link.label}
              </a>
            ) : (
              <NavLink to={link.to} className={getFooterLinkClass}>
                {link.label}
              </NavLink>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}