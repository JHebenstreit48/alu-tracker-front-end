import { createBrowserRouter } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import App from '@/App';
import ErrorPage from '@/pages/Error/ErrorPage';

// Only Home is lazy — Lighthouse tests the home page, this is the only
// page where lazy loading actually improves the performance score.
const Home = lazy(() => import('@/pages/MainPages/Home/Home'));

// Everything else eager — prevents SCSS chunk ordering issues and
// ensures images and styles load immediately on navigation and hard refresh.
import Brands from '@/pages/MainPages/Brands/Brands';
import Cars from '@/pages/MainPages/CarInfo/Cars';
import GarageLevels from '@/pages/MainPages/GarageLevels/GarageLevels';
import LegendStorePrices from '@/pages/MainPages/LegendStore/LegendStore';
import CarDetails from '@/pages/Subpages/CarDetails';
import CarTracker from '@/pages/Subpages/CarTracker';
import BrandInfo from '@/pages/MainPages/Brands/BrandInfo';
import Feedback from '@/pages/MainPages/Feedback/Feedback';
import Account from '@/pages/Subpages/Account';
import CarDataSubmission from '@/pages/Subpages/CarDataSubmission';
import About from '@/pages/Subpages/About';
import Sources from '@/pages/Subpages/Sources';
import AdminSubmissions from '@/pages/Subpages/AdminSubmissions';

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
        element: <Brands />,
      },
      {
        path: '/brands/:slug',
        element: <BrandInfo />,
      },
      {
        path: '/cars',
        element: <Cars />,
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
        element: <GarageLevels />,
      },
      {
        path: '/legendstoreprices',
        element: <LegendStorePrices />,
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
        path: '/admin/submissions',
        element: <AdminSubmissions />,
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