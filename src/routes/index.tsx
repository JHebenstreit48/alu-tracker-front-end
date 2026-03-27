import { createBrowserRouter } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import App from '@/App';
import Home from '@/pages/MainPages/Home/Home';
import ErrorPage from '@/pages/Error/ErrorPage';

// Subpages — eager loaded to prevent FOUC since they're accessed via
// direct links, buttons, and footer navigation
import CarDetails from '@/pages/Subpages/CarDetails';
import CarTracker from '@/pages/Subpages/CarTracker';
import BrandInfo from '@/pages/MainPages/Brands/BrandInfo';
import Feedback from '@/pages/MainPages/Feedback/Feedback';
import Account from '@/pages/Subpages/Account';
import CarDataSubmission from '@/pages/Subpages/CarDataSubmission';
import About from '@/pages/Subpages/About';
import Sources from '@/pages/Subpages/Sources';

// Main tab pages — lazy loaded since they're only visited intentionally
const Brands = lazy(() => import('@/pages/MainPages/Brands/Brands'));
const Cars = lazy(() => import('@/pages/MainPages/CarInfo/Cars'));
const GarageLevels = lazy(() => import('@/pages/MainPages/GarageLevels/GarageLevels'));
const LegendStorePrices = lazy(() => import('@/pages/MainPages/LegendStore/LegendStore'));

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: '/brands',
        element: <Suspense fallback={null}><Brands /></Suspense>,
      },
      {
        path: '/brands/:slug',
        element: <BrandInfo />,
      },
      {
        path: '/cars',
        element: <Suspense fallback={null}><Cars /></Suspense>,
      },
      {
        path: '/cars/:slug',
        element: <CarDetails />,
      },
      {
        path: '/car-tracker/',
        element: <CarTracker />,
      },
      {
        path: '/garagelevels',
        element: <Suspense fallback={null}><GarageLevels /></Suspense>,
      },
      {
        path: '/legendstoreprices',
        element: <Suspense fallback={null}><LegendStorePrices /></Suspense>,
      },
      {
        path: '/feedback',
        element: <Feedback />,
      },
      {
        path: '/account',
        element: <Account />,
      },
      {
        path: '/car-data-submission',
        element: <CarDataSubmission />,
      },
      {
        path: '/about',
        element: <About />,
      },
      {
        path: '/sources',
        element: <Sources />,
      },
    ],
  },
]);