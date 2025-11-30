import { useEffect } from "react";
import authService from "./services/authService";
import { userStore } from "./store/userStore";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/Auth/LoginPage";
import RegisterPage from "./pages/Auth/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import MinePlannerPage from "./pages/MinePlannerPage";
import ShippingPlannerPage from "./pages/ShippingPlannerPage";
import AIChatboxPage from "./pages/AIChatboxPage";
import ReportPage from "./pages/ReportPage";
import SimulationPage from "./pages/SimulationPage";
import ProtectedRoute from "./components/layout/ProtectedRoute";

function App() {
    const isAuthenticated = userStore((state) => state.isAuthenticated);

    useEffect(() => {
        if (isAuthenticated) authService.getProfile();
    }, [isAuthenticated]);
    
    return (
        <BrowserRouter>
            <Routes>

                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <DashboardPage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/mine-planner"
                    element={
                        <ProtectedRoute>
                            <MinePlannerPage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/shipping-planner"
                    element={
                        <ProtectedRoute>
                            <ShippingPlannerPage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/chat"
                    element={
                        <ProtectedRoute>
                            <AIChatboxPage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/report"
                    element={
                        <ProtectedRoute>
                            <ReportPage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/simulation"
                    element={
                        <ProtectedRoute>
                            <SimulationPage />
                        </ProtectedRoute>
                    }
                />

            </Routes>
        </BrowserRouter>
    );
}

export default App;
