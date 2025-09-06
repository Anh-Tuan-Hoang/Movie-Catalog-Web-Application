import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

function ProtectedRoute({ children }) {
  const { apiKey } = useAuth();

  if (!apiKey) {
    return <Navigate to="/Login" />;
  }

  return children;
}

export default ProtectedRoute;
