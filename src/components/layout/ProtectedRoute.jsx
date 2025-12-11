import React from "react";
import { Navigate } from "react-router-dom";
import { userStore } from "../../store/userStore";

function ProtectedRoute({ children }) {
    const isAuthenticated = userStore((state) => state.isAuthenticated);
    if (!isAuthenticated) return <Navigate to="/login" replace />;
    return children;
}

export default ProtectedRoute;
