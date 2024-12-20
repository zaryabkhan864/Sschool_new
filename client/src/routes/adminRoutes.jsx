import React from "react";
import { Route } from "react-router-dom";
import ProtectedRoute from "../Auth/ProtectedRoute";
import Dashboard from "../Dashboard/Dashboard";
const adminRoutes = () => {

  return (
    <>
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute admin={true}>
            <Dashboard />
          </ProtectedRoute>
        }
      />

    </>
  );
};

export default adminRoutes;
