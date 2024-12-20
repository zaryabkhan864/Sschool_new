import React, { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { LoaderIcon } from "react-hot-toast";

const ProtectedRoute = ({ children, admin }) => {
  const { isAuthenticated, user, loading } = useSelector((state) => state.auth);

  if (loading) return <LoaderIcon />;

  if (!isAuthenticated) {
    return <Navigate to="/" replace />; // Redirect to login if not authenticated
  }

  if (admin && user?.role !== "admin") {
    return <Navigate to="/" replace />; // Redirect if not admin for admin routes
  }

  return children;
};

export default ProtectedRoute;