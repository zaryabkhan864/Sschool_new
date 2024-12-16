import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Loader from "../layout/Loader";

const ProtectedRoute = ({ isAdmin, element }) => {
    const { isAuthenticated, loading, user } = useSelector((state) => state.auth);


    if (loading) return <Loader />; // Or a loader component

    if (!isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    if (isAdmin && user?.role !== "admin") {
        return <Navigate to="/dashboard" replace />;
    }

    return element; // Render the passed element
};

export default ProtectedRoute;
