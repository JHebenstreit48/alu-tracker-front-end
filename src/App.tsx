import { Suspense, useEffect, useState, useContext } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Footer from '@/components/Shared/HeaderFooter/Footer';
import { AuthContext } from '@/context/Auth/authContext';
import { syncFromAccount } from '@/utils/UserDataSync/syncFromAccount';
import '@/scss/PageAndHome/Page.scss';
import '@/scss/NavHeaderFooterError/Header.scss';
import '@/scss/NavHeaderFooterError/Navigation.scss';
import '@/scss/NavHeaderFooterError/Footer.scss';

// ✅ CarDetails SCSS hoisted here so it lands in the critical CSS bundle
// and is never chunk-split away from the eager CarDetails route.
// This prevents intermittent FOUC when navigating to /cars/:slug.
import '@/scss/Cars/CarDetails/CarDetail.scss';
import '@/scss/Cars/CarDetails/CarStatus.scss';
import '@/scss/Cars/CarDetails/UnitToggle.scss';
import '@/scss/Cars/CarDetails/CarComments.scss';

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
    const hasLocalData = Object.keys(localStorage).some((k) => k.startsWith('car-tracker-'));
    if (token && !hasLocalData) {
      console.log('[AutoSync] No local tracker found. Syncing from account…');
      void syncFromAccount(token);
    }
  }, [token]);

  return (
    <div className="AppRoot">
      <main
        id="content"
        className="AppMain"
      >
        <Suspense fallback={<div style={{ minHeight: '100vh' }} />}>
          <Outlet />
        </Suspense>
      </main>
      {showFooter && <Footer />}
    </div>
  );
}