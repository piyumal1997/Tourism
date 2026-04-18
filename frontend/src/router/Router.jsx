import { React, lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "../components/layout/Layout/Layout";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import ScrollToTop from "../components/common/ScrollToTop";

// Lazy-loaded page components for code splitting
const Home = lazy(() => import("../pages/Home/Home"));
const Destinations = lazy(() => import("../pages/Destinations/Destinations"));
const Experiences = lazy(() => import("../pages/Experiences/Experiences"));
const TravelTips = lazy(() => import("../pages/TravelTips/TravelTips"));
const LocationDetail = lazy(() => import("../pages/LocationDetail/LocationDetail"));
const NotFound = lazy(() => import("../pages/NotFound/NotFound"));
const FullScreenMap = lazy(() => import("../pages/Destinations/FullScreenMap"));
const RoutePlanner = lazy(() => import("../pages/Destinations/RoutePlanner"));

//Dashboard
const Login = lazy(() => import("../pages/Dashboard/Login"));
const Dashboard = lazy(() => import("../pages/Dashboard/Dashboard"));

const AppRouter = () => {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      }
    >
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="destinations" element={<Destinations />} />
          <Route path="destinations/map" element={<FullScreenMap />} />
          <Route path="destinations/route-planner" element={<RoutePlanner />} />
          <Route path="experiences" element={<Experiences />} />
          <Route path="travel-tips" element={<TravelTips />} />
          <Route path="location/:id" element={<LocationDetail />} />

          {/* Dashboard Routes */}
          <Route path="login" element={<Login />} />
          <Route path="dashboard" element={<Dashboard />} />

          {/* Not Found Route */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Suspense>
  );
};

export default AppRouter;