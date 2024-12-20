import React from "react";
import { Route } from "react-router-dom";
import Login from "../Auth/Login";

const userRoutes = () => {
  return (
    <>
      <Route path="/" element={<Login />} exact />
    </>
  );
};

export default userRoutes;
