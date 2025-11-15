import { Suspense, useEffect, useState, useContext } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Footer from "@/components/Shared/HeaderFooter/Footer";
import LoadingSpinner from "@/components/Shared/Loading/LoadingSpinner";

import { AuthContext } from "@/components/SignupLogin/context/AuthContext";
import { syncFromAccount } from "@/utils/UserDataSync/syncFromAccount";

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

  // Wake the auth service (for now, the only one we care about).
  useEffect(() => {
    const authBase = import.meta.env.VITE_AUTH_API_URL;

    // If it's not set, don't try to wake anything.
    if (!authBase) {
      if (import.meta.env.DEV) {
        console.warn("[Wake] VITE_AUTH_API_URL is not set; skipping wake.");
      }
      return;
    }

    const id = setTimeout(() => {
      const base = authBase.replace(/\/+$/, "");

      const endpoints: Record<string, string | string[]> = {
        [base]: ["/api/health", "/api/test"],
      };

      const status: Record<string, boolean> = Object.fromEntries(
        Object.keys(endpoints).map((b) => [b, false])
      );

      console.group("🟡 Wake monitor");
      console.table(
        Object.entries(status).map(([service, awake]) => ({ service, awake }))
      );

      void wakeServices({
        endpoints,
        retries: 4,
        timeoutMs: 7000,
        backoffMs: 1500,
        onUpdate: (b: string, info: WakeUpdateInfo) => {
          if (!info.done) return;
          status[b] = !!info.ok;
          const bits = [
            info.ok ? "✅ awake" : "❌ failed",
            info.status ? `[${info.status}]` : "",
            info.pathTried ?? "",
            `(tries: ${info.attempt})`,
          ].filter(Boolean);
          console.log(`${b} — ${bits.join(" ")}`);
          console.table(
            Object.entries(status).map(([service, awake]) => ({
              service,
              awake,
            }))
          );
        },
      }).then((finals) => {
        console.log("— final results —");
        console.table(
          Object.entries(finals).map(([service, awake]) => ({
            service,
            awake,
          }))
        );
        console.groupEnd();
      });
    }, 300);

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