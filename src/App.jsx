import { useEffect, Suspense, lazy } from "react";
import authService from "./services/authService";
import { userStore } from "./store/userStore";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

import { AnimatePresence } from "framer-motion";

// Lazy load pages
const LoginPage = lazy(() => import("./pages/Auth/LoginPage"));
const RegisterPage = lazy(() => import("./pages/Auth/RegisterPage"));
const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const MinePlannerPage = lazy(() => import("./pages/MinePlannerPage"));
const ShippingPlannerPage = lazy(() => import("./pages/ShippingPlannerPage"));
const AIChatboxPage = lazy(() => import("./pages/AIChatboxPage"));
const OverviewPage = lazy(() => import("./pages/OverviewPage"));
const ReportPage = lazy(() => import("./pages/ReportPage"));
const SimulationPage = lazy(() => import("./pages/SimulationPage"));

import ProtectedRoute from "./components/layout/ProtectedRoute";
import { GlobalFilterProvider } from "./context/GlobalFilterContext";
import NavbarWrapper from "./components/layout/NavbarWrapper";
import ErrorBoundary from "./components/ui/ErrorBoundary";
import LoadingSpinner from "./components/ui/LoadingSpinner";
import PageTransition from "./components/animation/PageTransition";

function App() {
  const isAuthenticated = userStore((state) => state.isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      authService.getProfile().catch(err => {
        console.error("Failed to get profile:", err);
      });
    }
  }, [isAuthenticated]);

  return (
    <GlobalFilterProvider>
      <ErrorBoundary>
        <BrowserRouter>
          <NavbarWrapper />
          <AppRoutes isAuthenticated={isAuthenticated} />
        </BrowserRouter>
      </ErrorBoundary>
    </GlobalFilterProvider>
  );
}

// ⬇️ komponen khusus untuk handle route + animasi
function AppRoutes({ isAuthenticated }) {
  const location = useLocation();

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {/* DEFAULT ROUTE: ketika user buka "/" */}
          <Route
            path="/"
            element={
              isAuthenticated ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          {/* AUTH */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* DASHBOARD */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <PageTransition>
                  <DashboardPage />
                </PageTransition>
              </ProtectedRoute>
            }
          />

          {/* MINE PLANNER */}
          <Route
            path="/mine-planner"
            element={
              <ProtectedRoute>
                <PageTransition>
                  <MinePlannerPage />
                </PageTransition>
              </ProtectedRoute>
            }
          />

          {/* SHIPPING PLANNER */}
          <Route
            path="/shipping-planner"
            element={
              <ProtectedRoute>
                <PageTransition>
                  <ShippingPlannerPage />
                </PageTransition>
              </ProtectedRoute>
            }
          />

          <Route
            path="/overview"
            element={
              <ProtectedRoute>
                <PageTransition>
                  <OverviewPage />
                </PageTransition>
              </ProtectedRoute>
            }
          />

          {/* AI CHATBOX */}
          <Route
            path="/chat"
            element={
              <ProtectedRoute>
                <PageTransition>
                  <AIChatboxPage />
                </PageTransition>
              </ProtectedRoute>
            }
          />

          {/* REPORTS */}
          <Route
            path="/report"
            element={
              <ProtectedRoute>
                <PageTransition>
                  <ReportPage />
                </PageTransition>
              </ProtectedRoute>
            }
          />

          {/* SIMULATION ANALYSIS */}
          <Route
            path="/simulation-analysis"
            element={
              <ProtectedRoute>
                <PageTransition>
                  <SimulationPage />
                </PageTransition>
              </ProtectedRoute>
            }
          />

          {/* FALLBACK: kalau user masuk path aneh, redirect lagi */}
          <Route
            path="*"
            element={
              isAuthenticated ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
        </Routes>
      </AnimatePresence>
    </Suspense>
  );
}

export default App;
