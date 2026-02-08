import { createBrowserRouter } from 'react-router-dom';
import App from '@/App';
import Home from '@/pages/MainPages/Home/Home';
import ErrorPage from '@/pages/Error/ErrorPage';

import Brands from '@/pages/MainPages/Brands/Brands';
import BrandInfo from '@/pages/MainPages/Brands/BrandInfo';

import Cars from '@/pages/MainPages/CarInfo/Cars';
import CarDetails from '@/pages/Subpages/CarDetails';
import GarageLevels from '@/pages/MainPages/GarageLevels/GarageLevels';
import LegendStorePrices from '@/pages/MainPages/LegendStore/LegendStore';
import CarTracker from '@/pages/Subpages/CarTracker';

import Feedback from '@/pages/MainPages/Feedback/Feedback'; // ← NEW
import Account from '@/pages/Subpages/Account';
import About from '@/pages/Subpages/About';
import Sources from '@/pages/Subpages/Sources'; // NEW

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