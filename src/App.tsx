import { Suspense, useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Footer from "@/components/Shared/Footer";
import LoadingSpinner from "@/components/Shared/LoadingSpinner";

import "@/SCSS/PageAndHome/Page.scss";
import "@/SCSS/NavHeaderFooterError/Header.scss";
import "@/SCSS/NavHeaderFooterError/Navigation.scss";
import "@/SCSS/NavHeaderFooterError/Footer.scss";

export default function App() {
  const location = useLocation();
  const [showFooter, setShowFooter] = useState(false);

  useEffect(() => {
    setShowFooter(false);
    const timer = setTimeout(() => setShowFooter(true), 50);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <div className="Page">
      <Suspense fallback={<LoadingSpinner />}>
        <Outlet /> {/* ✅ No header or navigation here */}
      </Suspense>
      {showFooter && <Footer />}
    </div>
  );
}
