import { Suspense, useEffect, useState, useContext } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Footer from "@/components/Shared/HeaderFooter/Footer";
import LoadingSpinner from "@/components/Shared/Loading/LoadingSpinner";

import { AuthContext } from "@/components/SignupLogin/context/AuthContext";
import { syncFromAccount } from "@/utils/UserDataSync/syncFromAccount";

import "@/scss/PageAndHome/Page.scss";
import "@/scss/NavHeaderFooterError/Header.scss";
import "@/scss/NavHeaderFooterError/Navigation.scss";
import "@/scss/NavHeaderFooterError/Footer.scss";

export default function App() {
  const location = useLocation();
  const { token } = useContext(AuthContext);
  const [showFooter, setShowFooter] = useState(false);

  // Expose syncFromAccount for quick manual testing in console
  useEffect(() => {
    (window as unknown as { syncFromAccount: typeof syncFromAccount }).syncFromAccount =
      syncFromAccount;
  }, []);

  // Re-mount footer after each route change (keeps gradient re-render smooth)
  useEffect(() => {
    setShowFooter(false);
    const timer = window.setTimeout(() => setShowFooter(true), 50);
    return () => window.clearTimeout(timer);
  }, [location.pathname]);

  // First-run sync if user is logged in but local store is empty
  useEffect(() => {
    const hasLocalData = Object.keys(localStorage).some((k) =>
      k.startsWith("car-tracker-")
    );
    if (token && !hasLocalData) {
      console.log("[AutoSync] No local tracker found. Syncing from account…");
      void syncFromAccount(token);
    }
  }, [token]);

  return (
    <div className="AppRoot">
      <main id="content" className="AppMain">
        <Suspense fallback={<LoadingSpinner />}>
          <Outlet />
        </Suspense>
      </main>
      {showFooter && <Footer />}
    </div>
  );
}