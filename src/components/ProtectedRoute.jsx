import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children , adminOnly = false }) {
  const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));


  if (!token || !user) {
    // Not logged in → redirect to login page
    return <Navigate to="/" replace />;
  }
  if (adminOnly && user.role !== "admin") {
    // Logged in but not admin → redirect to dashboard
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
