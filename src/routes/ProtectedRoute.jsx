import React from "react";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, allowedRoles }) {
    const role = localStorage.getItem("role");
    const adminId = localStorage.getItem("adminId");

    // Admin access
    if (allowedRoles.includes("ADMIN") && adminId) {
        return children;
    }

    // Doctor/Nurse access
    if (allowedRoles.includes(role)) {
        return children;
    }

    // Not authorized
    if (role === "DOCTOR" || role === "NURSE") {
        return <Navigate to="/dashboard" replace />;
    }

    return <Navigate to="/" replace />;
}

export default ProtectedRoute;