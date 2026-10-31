import { createBrowserRouter } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import App from '@/App';
import ErrorPage from '@/pages/Error/ErrorPage';

const Home = lazy(() => import('@/pages/MainPages/Home/Home'));
const Brands = lazy(() => import('@/pages/MainPages/Brands/Brands'));
const Cars = lazy(() => import('@/pages/MainPages/CarInfo/Cars'));
const GarageLevels = lazy(() => import('@/pages/MainPages/GarageLevels/GarageLevels'));
const LegendStorePrices = lazy(() => import('@/pages/MainPages/LegendStore/LegendStore'));
const Feedback = lazy(() => import('@/pages/MainPages/Feedback/Feedback'));

const CarDetails = lazy(() => import('@/pages/Subpages/CarData/CarDetailsAndTracker/CarDetails'));
const CarTracker = lazy(() => import('@/pages/Subpages/CarData/CarDetailsAndTracker/CarTracker'));
const Sources = lazy(() => import('@/pages/Subpages/CarData/CarDetailsAndTracker/Sources'));
const FavoritesViews = lazy(
  () => import('@/pages/Subpages/CarData/CarDetailsAndTracker/favoritesAndViews')
);

const About = lazy(() => import('@/pages/Subpages/Miscellaneous/About'));
const BrandInfo = lazy(() => import('@/pages/Subpages/Miscellaneous/BrandInfo'));
const QRCodePage = lazy(() => import('@/pages/Subpages/Miscellaneous/qrCode'));

const Account = lazy(() => import('@/pages/Subpages/UserAccounts/AccountBasics/Account'));
const ConfirmEmailChange = lazy(
  () => import('@/pages/Subpages/UserAccounts/UpdateInfo/confirmEmailChange')
);
const ForgotPassword = lazy(
  () => import('@/pages/Subpages/UserAccounts/forgotUsernameAndPassword/forgotPassword')
);
const ForgotUsername = lazy(
  () => import('@/pages/Subpages/UserAccounts/forgotUsernameAndPassword/forgotUsername')
);

const CarDataSubmission = lazy(
  () => import('@/pages/Subpages/CarData/CarDataUpdates/CarDataSubmission')
);
const AdminSubmissions = lazy(
  () => import('@/pages/Subpages/CarData/CarDataUpdates/AdminSubmissions')
);

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={null}>
            <Home />
          </Suspense>
        ),
      },
      {
        path: '/brands',
        element: (
          <Suspense fallback={null}>
            <Brands />
          </Suspense>
        ),
      },
      {
        path: '/brands/:slug',
        element: (
          <Suspense fallback={null}>
            <BrandInfo />
          </Suspense>
        ),
      },
      {
        path: '/cars',
        element: (
          <Suspense fallback={null}>
            <Cars />
          </Suspense>
        ),
      },
      {
        path: '/cars/:slug',
        element: (
          <Suspense fallback={null}>
            <CarDetails />
          </Suspense>
        ),
      },
      {
        path: '/car-tracker/',
        element: (
          <Suspense fallback={null}>
            <CarTracker />
          </Suspense>
        ),
      },
      {
        path: '/car-tracker/favorites',
        element: (
          <Suspense fallback={null}>
            <FavoritesViews />
          </Suspense>
        ),
      },
      {
        path: '/garagelevels',
        element: (
          <Suspense fallback={null}>
            <GarageLevels />
          </Suspense>
        ),
      },
      {
        path: '/legendstoreprices',
        element: (
          <Suspense fallback={null}>
            <LegendStorePrices />
          </Suspense>
        ),
      },
      {
        path: '/feedback',
        element: (
          <Suspense fallback={null}>
            <Feedback />
          </Suspense>
        ),
      },
      {
        path: '/account',
        element: (
          <Suspense fallback={null}>
            <Account />
          </Suspense>
        ),
      },
      {
        path: '/car-data-submission',
        element: (
          <Suspense fallback={null}>
            <CarDataSubmission />
          </Suspense>
        ),
      },
      {
        path: '/admin/submissions',
        element: (
          <Suspense fallback={null}>
            <AdminSubmissions />
          </Suspense>
        ),
      },
      {
        path: '/about',
        element: (
          <Suspense fallback={null}>
            <About />
          </Suspense>
        ),
      },
      {
        path: '/sources',
        element: (
          <Suspense fallback={null}>
            <Sources />
          </Suspense>
        ),
      },
      {
        path: '/qrcode',
        element: (
          <Suspense fallback={null}>
            <QRCodePage />
          </Suspense>
        ),
      },
      {
        path: '/confirm-email-change',
        element: (
          <Suspense fallback={null}>
            <ConfirmEmailChange />
          </Suspense>
        ),
      },
      {
        path: '/forgot-password',
        element: (
          <Suspense fallback={null}>
            <ForgotPassword />
          </Suspense>
        ),
      },
      {
        path: '/forgot-username',
        element: (
          <Suspense fallback={null}>
            <ForgotUsername />
          </Suspense>
        ),
      },
    ],
  },
]);
