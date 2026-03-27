import { Suspense, useEffect, useState, useContext } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Footer from "@/components/Shared/HeaderFooter/Footer";
import { AuthContext } from "@/context/Auth/authContext";
import { syncFromAccount } from "@/utils/UserDataSync/syncFromAccount";
import "@/scss/PageAndHome/Page.scss";
import "@/scss/NavHeaderFooterError/Header.scss";
import "@/scss/NavHeaderFooterError/Navigation.scss";
import "@/scss/NavHeaderFooterError/Footer.scss";

export default function App() {
  const location = useLocation();
  const { token } = useContext(AuthContext);
  const [showFooter, setShowFooter] = useState(false);

  useEffect(() => {
    (window as unknown as { syncFromAccount: typeof syncFromAccount }).syncFromAccount =
      syncFromAccount;
  }, []);

  useEffect(() => {
    setShowFooter(false);
    const timer = window.setTimeout(() => setShowFooter(true), 50);
    return () => window.clearTimeout(timer);
  }, [location.pathname]);

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
        <Suspense fallback={null}>
          <Outlet />
        </Suspense>
      </main>
      {showFooter && <Footer />}
    </div>
  );
}