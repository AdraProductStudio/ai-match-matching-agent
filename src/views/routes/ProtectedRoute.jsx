import { Navigate, Outlet } from "react-router-dom";

const authUser = () => {
  if (sessionStorage.getItem("accessToken")) {
    return true
  }
  return false
};

const ProtectedRoute = () => {
  const isAuth = authUser();

  return isAuth ? <Outlet /> : <Navigate to="/" replace />;
};

export default ProtectedRoute;
