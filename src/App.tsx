import { Suspense, useEffect, useState, useContext } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Footer from "@/components/Shared/Footer";
import LoadingSpinner from "@/components/Shared/LoadingSpinner";

import { AuthContext } from "@/components/SignupLogin/context/AuthContext";
import { syncFromAccount } from "@/components/CarInformation/UserDataSync/syncFromAccount";

import "@/scss/PageAndHome/Page.scss";
import "@/scss/NavHeaderFooterError/Header.scss";
import "@/scss/NavHeaderFooterError/Navigation.scss";
import "@/scss/NavHeaderFooterError/Footer.scss";

export default function App() {
  const location = useLocation();
  const { token } = useContext(AuthContext);
  const [showFooter, setShowFooter] = useState(false);

  // ✅ Expose syncFromAccount to window without any or global.d.ts
  useEffect(() => {
    (window as unknown as { syncFromAccount: typeof syncFromAccount }).syncFromAccount = syncFromAccount;
  }, []);

  useEffect(() => {
    setShowFooter(false);
    const timer = setTimeout(() => setShowFooter(true), 50);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  useEffect(() => {
    const hasLocalData = Object.keys(localStorage).some((key) =>
      key.startsWith("car-tracker-")
    );

    if (token && !hasLocalData) {
      console.log("[AutoSync] No local tracker found. Syncing from account...");
      syncFromAccount(token);
    }
  }, [token]);

  return (
    <div className="Page">
      <Suspense fallback={<LoadingSpinner />}>
        <Outlet />
      </Suspense>
      {showFooter && <Footer />}
    </div>
  );
}
