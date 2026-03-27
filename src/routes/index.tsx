import { createBrowserRouter } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import App from '@/App';
import Home from '@/pages/MainPages/Home/Home';
import ErrorPage from '@/pages/Error/ErrorPage';

// All non-home pages load lazily — only downloaded when user visits that route
const Brands = lazy(() => import('@/pages/MainPages/Brands/Brands'));
const BrandInfo = lazy(() => import('@/pages/MainPages/Brands/BrandInfo'));
const Cars = lazy(() => import('@/pages/MainPages/CarInfo/Cars'));
const CarDetails = lazy(() => import('@/pages/Subpages/CarDetails'));
const GarageLevels = lazy(() => import('@/pages/MainPages/GarageLevels/GarageLevels'));
const LegendStorePrices = lazy(() => import('@/pages/MainPages/LegendStore/LegendStore'));
const CarTracker = lazy(() => import('@/pages/Subpages/CarTracker'));
const Feedback = lazy(() => import('@/pages/MainPages/Feedback/Feedback'));
const Account = lazy(() => import('@/pages/Subpages/Account'));
const CarDataSubmission = lazy(() => import('@/pages/Subpages/CarDataSubmission'));
const About = lazy(() => import('@/pages/Subpages/About'));
const Sources = lazy(() => import('@/pages/Subpages/Sources'));

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
        element: <Suspense fallback={null}><BrandInfo /></Suspense>,
      },
      {
        path: '/cars',
        element: <Suspense fallback={null}><Cars /></Suspense>,
      },
      {
        path: '/cars/:slug',
        element: <Suspense fallback={null}><CarDetails /></Suspense>,
      },
      {
        path: '/car-tracker/',
        element: <Suspense fallback={null}><CarTracker /></Suspense>,
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
        element: <Suspense fallback={null}><Feedback /></Suspense>,
      },
      {
        path: '/account',
        element: <Suspense fallback={null}><Account /></Suspense>,
      },
      {
        path: '/car-data-submission',
        element: <Suspense fallback={null}><CarDataSubmission /></Suspense>,
      },
      {
        path: '/about',
        element: <Suspense fallback={null}><About /></Suspense>,
      },
      {
        path: '/sources',
        element: <Suspense fallback={null}><Sources /></Suspense>,
      },
    ],
  },
]);