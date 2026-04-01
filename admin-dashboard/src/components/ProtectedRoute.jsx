import React from "react";
import { Navigate } from "react-router-dom";
import { useAdminAuthStore } from "../store/authStore";

export default function ProtectedRoute({ children }) {
  const initialized = useAdminAuthStore((state) => state.initialized);
  const user = useAdminAuthStore((state) => state.user);

  if (!initialized) {
    return <div className="auth-shell"><div className="auth-card">Loading session...</div></div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
