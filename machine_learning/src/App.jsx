import { useEffect, Suspense } from "react";
import authService from "./services/authService";
import { userStore } from "./store/userStore";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

import { AnimatePresence } from "framer-motion"; // ⬅️ baru

import LoginPage from "./pages/Auth/LoginPage";
import RegisterPage from "./pages/Auth/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import MinePlannerPage from "./pages/MinePlannerPage";
import ShippingPlannerPage from "./pages/ShippingPlannerPage";
import AIChatboxPage from "./pages/AIChatboxPage";
import OverviewPage from "./pages/OverviewPage";
import ReportPage from "./pages/ReportPage";
import SimulationPage from "./pages/SimulationPage";

import ProtectedRoute from "./components/layout/ProtectedRoute";
import { GlobalFilterProvider } from "./context/GlobalFilterContext";
import NavbarWrapper from "./components/layout/NavbarWrapper";
import ErrorBoundary from "./components/ui/ErrorBoundary";
import LoadingSpinner from "./components/ui/LoadingSpinner";

// ⬇️ animasi wrapper
import PageTransition from "./components/animation/PageTransition";

function App() {
  const isAuthenticated = userStore((state) => state.isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) authService.getProfile();
  }, [isAuthenticated]);

  return (
    <GlobalFilterProvider>
      <ErrorBoundary>
        <BrowserRouter>
          <NavbarWrapper />
          {/* Routes dipisah ke komponen tersendiri supaya bisa pakai useLocation */}
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
