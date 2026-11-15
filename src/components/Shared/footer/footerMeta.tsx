import { NavLink } from "react-router-dom";
import { getFooterLinkClass } from "@/utils/shared/footerLinks";

const YEAR = new Date().getFullYear();

export default function FooterMeta() {
  return (
    <div className="Footer__meta">
      <span className="Footer__fineprint">© {YEAR} Asphalt Legends Tracker</span>
      <span className="Footer__fineprint">Unofficial fan project</span>
      <span className="Footer__fineprint">Not affiliated with Gameloft</span>
      <NavLink to="/qrcode" className={getFooterLinkClass}>
        Digital Card
      </NavLink>
    </div>
  );
}