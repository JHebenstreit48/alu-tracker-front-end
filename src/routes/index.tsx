import { createBrowserRouter } from "react-router-dom";
import App from "@/App";
import Home from "@/pages/MainPages/Home/Home";
import ErrorPage from "@/pages/Error/ErrorPage";

import Brands from "@/pages/MainPages/Brands/Brands";
import BrandInfo from "@/pages/MainPages/Brands/BrandInfo";

import Cars from "@/pages/MainPages/CarInfo/Cars";
import CarDetails from "@/pages/MainPages/CarInfo/CarDetails";
import GarageLevels from "@/pages/MainPages/GarageLevels/GarageLevels";
import LegendStorePrices from "@/pages/MainPages/LegendStore/LegendStore";
import CarTrackerPage from "@/pages/MainPages/CarInfo/CarTracker";

import Feedback from "@/pages/MainPages/Feedback/Feedback"; // ← NEW

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Home /> },
      { path: "/brands", element: <Brands /> },
      { path: "/brands/:slug", element: <BrandInfo /> },
      { path: "/cars", element: <Cars /> },
      { path: "/cars/:slug", element: <CarDetails /> },
      { path: "/car-tracker/", element: <CarTrackerPage /> },
      { path: "/garagelevels", element: <GarageLevels /> },
      { path: "/legendstoreprices", element: <LegendStorePrices /> },
      { path: "/feedback", element: <Feedback /> }, // ← NEW
    ],
  },
]);
