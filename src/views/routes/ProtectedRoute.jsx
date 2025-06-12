import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import Cookies from "js-cookie";

const authUser = () => {
  if (Cookies.get("accessToken")) {
    return true
  }
  return false
};

const ProtectedRoute = () => {
  const isAuth = authUser();

  return isAuth ? <Outlet /> : <Navigate to="/" replace />;
};

export default ProtectedRoute;
