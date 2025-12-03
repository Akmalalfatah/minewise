import { useEffect, Suspense } from "react";
import authService from "./services/authService";
import { userStore } from "./store/userStore";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/Auth/LoginPage";
import RegisterPage from "./pages/Auth/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import MinePlannerPage from "./pages/MinePlannerPage";
import ShippingPlannerPage from "./pages/ShippingPlannerPage";
import AIChatboxPage from "./pages/AIChatboxPage";
import ReportPage from "./pages/ReportPage";
import SimulationPage from "./pages/SimulationPage";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import { GlobalFilterProvider } from "./context/GlobalFilterContext";
import { NavbarWrapper } from "./components/layout/NavbarWrapper";
import { ErrorBoundary } from "./components/ui/ErrorBoundary";
import { LoadingSpinner } from "./components/ui/LoadingSpinner";

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
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
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
                    <DashboardPage />
                  </ProtectedRoute>
                }
              />

              {/* MINE PLANNER */}
              <Route
                path="/mine-planner"
                element={
                  <ProtectedRoute>
                    <MinePlannerPage />
                  </ProtectedRoute>
                }
              />

              {/* SHIPPING PLANNER */}
              <Route
                path="/shipping-planner"
                element={
                  <ProtectedRoute>
                    <ShippingPlannerPage />
                  </ProtectedRoute>
                }
              />

              {/* AI CHATBOX */}
              <Route
                path="/chat"
                element={
                  <ProtectedRoute>
                    <AIChatboxPage />
                  </ProtectedRoute>
                }
              />

              {/* REPORTS */}
              <Route
                path="/report"
                element={
                  <ProtectedRoute>
                    <ReportPage />
                  </ProtectedRoute>
                }
              />

              {/* SIMULATION ANALYSIS */}
              <Route
                path="/simulation-analysis"
                element={
                  <ProtectedRoute>
                    <SimulationPage />
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
          </Suspense>
        </BrowserRouter>
      </ErrorBoundary>
    </GlobalFilterProvider>
  );
}

export default App;
