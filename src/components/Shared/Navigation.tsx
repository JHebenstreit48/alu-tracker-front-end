import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

interface INavigationButtons {
  label: string;
}

const NavigationButtons = (
  props: INavigationButtons & { isActive: boolean; onClick: () => void }
) => {
  return (
    <button
      onClick={props.onClick}
      type="button"
      className={`btn btn-primary btn-lg ${props.isActive ? "active-link" : ""}`}
    >
      {props.label}
    </button>
  );
};

export default function Navigation() {
  const navigation = useNavigate();
  const currentPage = useLocation().pathname;
  const [isOpen, setIsOpen] = useState(false);

  const NavLinks = [
    { label: "Home", path: () => navigation("/"), location: "/" },
    { label: "Brands", path: () => navigation("/brands"), location: "/brands" },
    { label: "Cars", path: () => navigation("/cars"), location: "/cars" },
    { label: "Garage Levels", path: () => navigation("/garagelevels"), location: "/garagelevels" },
    { label: "Legend Store", path: () => navigation("/legendstoreprices"), location: "/legendstoreprices" },
  ];

  return (
    <>
      <button className="Hamburger" onClick={() => setIsOpen(!isOpen)}>
        ☰
      </button>
      <div className={`NavigationWrapper ${isOpen ? "open" : ""}`}>
        <ul className="nav-css">
          {NavLinks.map((navLinks) => (
            <NavigationButtons
              key={navLinks.label}
              onClick={navLinks.path}
              label={navLinks.label}
              isActive={currentPage === navLinks.location}
            />
          ))}
        </ul>
      </div>
    </>
  );
}
