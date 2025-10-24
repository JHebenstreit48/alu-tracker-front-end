import { Suspense, useEffect, useState, useContext } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Footer from "@/components/Shared/HeaderFooter/Footer";
import LoadingSpinner from "@/components/Shared/Loading/LoadingSpinner";

import { AuthContext } from "@/components/SignupLogin/context/AuthContext";
import { syncFromAccount } from "@/components/UserDataSync/syncFromAccount";
import { wakeServices } from "@/lib/wake/wakeServices";
import type { WakeUpdateInfo } from "@/lib/wake/wakeServices";

import "@/scss/PageAndHome/Page.scss";
import "@/scss/NavHeaderFooterError/Header.scss";
import "@/scss/NavHeaderFooterError/Navigation.scss";
import "@/scss/NavHeaderFooterError/Footer.scss";

export default function App() {
  const location = useLocation();
  const { token } = useContext(AuthContext);
  const [showFooter, setShowFooter] = useState(false);

  // Fire-and-forget wake after first paint; stream a live boolean table to console.
  useEffect(() => {
    const id = setTimeout(() => {
      const endpoints: Record<string, string> = {
        [import.meta.env.VITE_AUTH_API_URL as string]: "/api/health",
        [import.meta.env.VITE_CARS_API_BASE_URL as string]: "/api/health",
        [import.meta.env.VITE_COMMENTS_API_BASE_URL as string]: "/api/health",
        [import.meta.env.VITE_CONTENT_API_BASE_URL as string]: "/api/health",
      };

      // strict booleans: start all false; flip true as each wakes
      const status: Record<string, boolean> = Object.fromEntries(
        Object.keys(endpoints).map((base) => [base, false])
      );

      console.group("🟡 Wake monitor");
      console.table(
        Object.entries(status).map(([service, awake]) => ({ service, awake }))
      );

      void wakeServices({
        endpoints,
        onUpdate: (base: string, info: WakeUpdateInfo) => {
          if (!info.done) return; // keep current value while pending
          status[base] = !!info.ok; // false -> true on success; stays/sets false on fail
          console.log(
            `${info.ok ? "✅" : "❌"} ${base} — ${info.ok ? "awake" : "failed"} (tries: ${info.attempt})`
          );
          console.table(
            Object.entries(status).map(([service, awake]) => ({ service, awake }))
          );
        },
      }).then((finals) => {
        console.log("— final results —");
        console.table(
          Object.entries(finals).map(([service, awake]) => ({ service, awake }))
        );
        console.groupEnd();
      });
    }, 300); // tiny delay avoids stampede at t=0
    return () => clearTimeout(id);
  }, []);

  // Expose syncFromAccount for quick manual testing in console
  useEffect(() => {
    (window as unknown as { syncFromAccount: typeof syncFromAccount }).syncFromAccount =
      syncFromAccount;
  }, []);

  // Re-mount footer after each route change (keeps gradient re-render smooth)
  useEffect(() => {
    setShowFooter(false);
    const timer = setTimeout(() => setShowFooter(true), 50);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  // First-run sync if user is logged in but local store is empty
  useEffect(() => {
    const hasLocalData = Object.keys(localStorage).some((k) => k.startsWith("car-tracker-"));
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