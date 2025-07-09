import { Navigate, Outlet } from "react-router-dom";

const authUser = () => {
  if (sessionStorage.getItem("accessToken")) {
    return true
  }
  return false
};

const authUserFromOauth = () => {

  const queryParams = new URLSearchParams(window.location.search).get('token');
  if (!queryParams) return;

  const parts = queryParams.split(".");
  let payload;
  try {
    payload = JSON.parse(atob(parts[1]));
  } catch (e) {
    console.error("Invalid token");
    return;
  }

  const emailFromToken = payload.sub;
  const sessionTokenFromToken = payload.session_token;
  const accessTokenFromToken = payload.access_token;

  if (accessTokenFromToken && sessionTokenFromToken && emailFromToken) {
    var uri = window.location.toString();
    if (uri.indexOf("?") > 0) {
      var clean_uri = uri.substring(0, uri.indexOf("?"));
      window.history.replaceState({}, document.title, clean_uri);
    }

    if (accessTokenFromToken && sessionTokenFromToken && emailFromToken) {
      sessionStorage.setItem("accessToken", accessTokenFromToken)
      sessionStorage.setItem("session_token", sessionTokenFromToken)
      sessionStorage.setItem("phone_number", emailFromToken)

      return true;
    }
  }
  return false;
}

const ProtectedRoute = () => {
  const isAuth = authUser() || authUserFromOauth();

  return isAuth ? <Outlet /> : <Navigate to="/" replace />;
};

export default ProtectedRoute;
